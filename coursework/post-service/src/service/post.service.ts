import { Injectable } from '@nestjs/common'
import { PostNotFound } from 'lib-core/dist/error/post'
import {
  CreatePostRequest,
  DeletePostRequest,
  DeletePostResponse,
  GetPostRequest,
  ListPostsRequest,
  PostDto,
  UpdatePostRequest,
} from 'lib-core/src/dto/post.dto'
import { PostRepository } from 'src/repository/post.repository'
import { SelectPostRow } from 'src/repository/rows'

import { UserService } from './user.service'

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userService: UserService,
  ) {}

  async createPost(postContent: CreatePostRequest): Promise<string> {
    const { content, authorId } = postContent

    return await this.postRepository.createPost(content, authorId)
  }

  async getPosts(listPostsRequest: ListPostsRequest): Promise<PostDto[]> {
    const { limit, offset, authorId } = listPostsRequest

    const dbPosts = await this.postRepository.getPosts(limit, offset, authorId)

    const authorIds = dbPosts.map((post) => post.author)

    const usernames = await this.userService.getUsernames({ userIds: authorIds })

    const authors = new Map(usernames.users.map((u) => [u.userId, u.userName]))

    return dbPosts.map(({ uid: id, content, author, updatedat, createdat }) => {
      return {
        id,
        content,
        author: authors.get(author),
        date: updatedat ?? createdat,
      }
    })
  }

  async getPost(getPostRequest: GetPostRequest): Promise<PostDto> {
    const { postId } = getPostRequest

    const postRow = await this.postRepository.getPost(postId)
    if (!postRow) {
      throw new PostNotFound()
    }

    return await this.mapPostRowToPostDto(postRow)
  }

  async updatePost(updatePostRequest: UpdatePostRequest): Promise<PostDto> {
    const { postId, content, authorId } = updatePostRequest

    const postRow = await this.postRepository.updatePost(postId, content, authorId)
    if (!postRow) {
      throw new PostNotFound()
    }

    return await this.mapPostRowToPostDto(postRow)
  }

  async deletePost(deletePostRequest: DeletePostRequest): Promise<DeletePostResponse> {
    const { postId, authorId } = deletePostRequest

    const removedUid = await this.postRepository.deletePost(postId, authorId)
    if (!removedUid) {
      throw new PostNotFound()
    }

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
}
