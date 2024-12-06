import { Injectable } from '@nestjs/common'
import { CreatePostRequest, ListPostsRequest, PostDto } from 'lib-core/src/dto/post.dto'
import { PostRepository } from 'src/repository/post.repository'

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

    return dbPosts.map(({ content, author, updatedat, createdat }) => {
      return {
        content,
        author: authors.get(author),
        date: updatedat ?? createdat,
      }
    })
  }
}
