import { Inject } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import {
  CreatePostRequest,
  CreatePostResponse,
  DeletePostRequest,
  DeletePostResponse,
  GetPostRequest,
  ListPostsRequest,
  PostDto,
  UpdatePostRequest,
} from 'lib-core/dist/dto/post.dto'
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

  @MessagePattern('post.get')
  async getPost(getPostRequest: GetPostRequest): Promise<PostDto> {
    const post = await this.postService.getPost(getPostRequest)

    return post
  }

  @MessagePattern('post.update')
  async updatePost(updatePostRequest: UpdatePostRequest): Promise<PostDto> {
    const post = await this.postService.updatePost(updatePostRequest)

    return post
  }

  @MessagePattern('post.delete')
  async deletePost(deletePostRequest: DeletePostRequest): Promise<DeletePostResponse> {
    const deleteResponse = await this.postService.deletePost(deletePostRequest)

    return deleteResponse
  }
}
