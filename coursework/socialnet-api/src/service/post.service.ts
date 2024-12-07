import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
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
import { firstValueFrom, timeout } from 'rxjs'

@Injectable()
export class PostService {
  constructor(@Inject('POST_SERVICE') private readonly client: ClientProxy) {}

  async createPost(cratePostRequest: CreatePostRequest): Promise<CreatePostResponse> {
    return await firstValueFrom(
      this.client.send<CreatePostResponse, CreatePostRequest>('post.create', cratePostRequest).pipe(timeout(5000)),
    )
  }

  async listPosts(listPostsRequest: ListPostsRequest): Promise<ListPostsResponse> {
    return await firstValueFrom(
      this.client.send<ListPostsResponse, ListPostsRequest>('post.list', listPostsRequest).pipe(timeout(5000)),
    )
  }

  async getPost(getPostRequest: GetPostRequest): Promise<PostDto> {
    return await firstValueFrom(
      this.client.send<PostDto, GetPostRequest>('post.get', getPostRequest).pipe(timeout(5000)),
    )
  }

  async updatePost(updatePostRequest: UpdatePostRequest): Promise<PostDto> {
    return await firstValueFrom(
      this.client.send<PostDto, UpdatePostRequest>('post.update', updatePostRequest).pipe(timeout(5000)),
    )
  }

  async deletePost(deletePostRequest: DeletePostRequest): Promise<DeletePostResponse> {
    return await firstValueFrom(
      this.client.send<DeletePostResponse, DeletePostRequest>('post.delete', deletePostRequest).pipe(timeout(5000)),
    )
  }
}
