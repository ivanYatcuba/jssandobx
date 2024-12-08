import { Inject } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
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
} from 'lib-core/dist/dto/post.dto'
import { PostService } from 'src/service/post.service'

export class PostController {
  constructor(@Inject() private readonly postService: PostService) {}

  @MessagePattern('post.create')
  async createPost(cratePostRequest: CreatePostRequest): Promise<CreatePostResponse> {
    return await this.postService.createPost(cratePostRequest)
  }

  @MessagePattern('post.list')
  async listPosts(listPostsRequest: ListPostsRequest): Promise<ListPostsResponse> {
    return await this.postService.getPosts(listPostsRequest)
  }

  @MessagePattern('post.get')
  async getPost(getPostRequest: GetPostRequest): Promise<PostDto> {
    return await this.postService.getPost(getPostRequest)
  }

  @MessagePattern('post.update')
  async updatePost(updatePostRequest: UpdatePostRequest): Promise<PostDto> {
    return await this.postService.updatePost(updatePostRequest)
  }

  @MessagePattern('post.delete')
  async deletePost(deletePostRequest: DeletePostRequest): Promise<DeletePostResponse> {
    return await this.postService.deletePost(deletePostRequest)
  }
}
