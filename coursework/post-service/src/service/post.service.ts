import { Injectable } from '@nestjs/common'
import { CreatePostRequest } from 'src/dto/post.dto'
import { PostRepository } from 'src/repository/post.repository'

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async createPost(postContent: CreatePostRequest): Promise<string> {
    const { content, authorId } = postContent

    return await this.postRepository.createPost(content, authorId)
  }
}
