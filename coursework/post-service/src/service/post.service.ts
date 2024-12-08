import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { PostNotFound } from 'lib-core/dist/error/post'
import {
  CreatePostRequest,
  CreatePostResponse,
  DeletePostRequest,
  DeletePostResponse,
  GetPostRequest,
  ListPostsRequest,
  ListPostsResponse,
  PostDto,
  UpdatePostRequest,
} from 'lib-core/src/dto/post.dto'
import { PostRepository } from 'src/repository/post.repository'
import { SelectPostRow } from 'src/repository/rows'

import { UserService } from './user.service'

@Injectable()
export class PostService {
  private readonly cacheTtl: number = Number(process.env.CACHE_TTL)

  constructor(
    private readonly postRepository: PostRepository,
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly logger: Logger,
  ) {}

  async createPost(postContent: CreatePostRequest): Promise<CreatePostResponse> {
    const { content, authorId } = postContent

    const postId = await this.postRepository.createPost(content, authorId)

    await this.clearListCache()

    return {
      postId,
    }
  }

  async getPosts(listPostsRequest: ListPostsRequest): Promise<ListPostsResponse> {
    const { limit, offset, authorId } = listPostsRequest

    const cacheKey = `list.post:${limit}:${offset}:${authorId ?? '-'}`
    const cachedPosts = await this.cacheManager.get<PostDto[]>(cacheKey)
    if (cachedPosts) {
      this.logger.log(`returning cached page ${cacheKey}`)

      return {
        posts: cachedPosts,
      }
    }

    const dbPosts = await this.postRepository.getPosts(limit, offset, authorId)

    const authorIds = dbPosts.map((post) => post.author)

    const usernames = await this.userService.getUsernames({ userIds: authorIds })

    const authors = new Map(usernames.users.map((u) => [u.userId, u.userName]))

    const posts: PostDto[] = dbPosts.map(({ uid: id, content, author, updatedat, createdat }) => {
      return {
        id,
        content,
        author: authors.get(author),
        date: updatedat ?? createdat,
      }
    })

    await this.cacheManager.set(cacheKey, posts, this.cacheTtl)

    return {
      posts,
    }
  }

  async getPost(getPostRequest: GetPostRequest): Promise<PostDto> {
    const { postId } = getPostRequest

    const cacheKey = this.postCacheKey(postId)
    const cachedPost = await this.cacheManager.get<PostDto>(cacheKey)
    if (cachedPost) {
      this.logger.log('returning cached post')

      return cachedPost
    }

    const postRow = await this.postRepository.getPost(postId)
    if (!postRow) {
      throw new PostNotFound()
    }

    const post = await this.mapPostRowToPostDto(postRow)

    await this.cacheManager.set(cacheKey, post, this.cacheTtl)

    return post
  }

  async updatePost(updatePostRequest: UpdatePostRequest): Promise<PostDto> {
    const { postId, content, authorId } = updatePostRequest

    const postRow = await this.postRepository.updatePost(postId, content, authorId)
    if (!postRow) {
      throw new PostNotFound()
    }

    const post = await this.mapPostRowToPostDto(postRow)

    const cacheKey = this.postCacheKey(postId)

    await this.cacheManager.set(cacheKey, post, this.cacheTtl)
    await this.clearListCache()

    return post
  }

  async deletePost(deletePostRequest: DeletePostRequest): Promise<DeletePostResponse> {
    const { postId, authorId } = deletePostRequest

    const removedUid = await this.postRepository.deletePost(postId, authorId)
    if (!removedUid) {
      throw new PostNotFound()
    }

    const cacheKey = this.postCacheKey(postId)

    await this.cacheManager.del(cacheKey)
    await this.clearListCache()

    return { postId: removedUid }
  }

  private async mapPostRowToPostDto(row: SelectPostRow): Promise<PostDto> {
    const { uid: id, content, author: authorId, updatedat, createdat } = row

    const usernames = await this.userService.getUsernames({ userIds: [authorId] })

    const author = usernames.users.filter((user) => user.userId === authorId)[0]

    return {
      id,
      content,
      author: author.userName,
      date: updatedat ?? createdat,
    }
  }

  private async clearListCache(): Promise<void> {
    const keys = await this.cacheManager.store.keys('list.post:*')

    if (keys.length > 0) {
      this.logger.log(`clearing post list cache keys ${JSON.stringify(keys)}`)

      await this.cacheManager.store.mdel(...keys)
    }
  }

  private postCacheKey(postId: string): string {
    return `get.post:${postId}`
  }
}
