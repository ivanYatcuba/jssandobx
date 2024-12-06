import { Inject } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { CreatePostRequest, CreatePostResponse, ListPostsRequest, PostDto } from 'lib-core/dist/dto/post.dto'
import { PostService } from 'src/service/post.service'

export class PostController {
  constructor(@Inject() private readonly postService: PostService) {}

  @MessagePattern('post.create')
  async createPost(cratePostRequest: CreatePostRequest): Promise<CreatePostResponse> {
    const newPostId = await this.postService.createPost(cratePostRequest)

    return { postId: newPostId }
  }

  @MessagePattern('post.list')
  async listPosts(listPostsRequest: ListPostsRequest): Promise<PostDto[]> {
    const posts = await this.postService.getPosts(listPostsRequest)

    return posts
  }
}
