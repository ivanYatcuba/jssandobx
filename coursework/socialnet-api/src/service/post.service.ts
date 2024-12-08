import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { clientCall } from 'lib-core/dist/client/util'
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
import { timeout } from 'rxjs'
import { ListPostsResp } from 'src/dto/response/post.responses.dto'

@Injectable()
export class PostService {
  constructor(@Inject('POST_SERVICE') private readonly client: ClientProxy) {}

  async createPost(cratePostRequest: CreatePostRequest): Promise<CreatePostResponse> {
    return await clientCall(this.client.send<CreatePostResponse, CreatePostRequest>('post.create', cratePostRequest))
  }

  async listPosts(listPostsRequest: ListPostsRequest): Promise<ListPostsResponse> {
    return await clientCall(this.client.send<ListPostsResponse, ListPostsRequest>('post.list', listPostsRequest))
  }

  async getPost(getPostRequest: GetPostRequest): Promise<ListPostsResp> {
    return await clientCall(
      this.client.send<ListPostsResp, GetPostRequest>('post.get', getPostRequest).pipe(timeout(5000)),
    )
  }

  async updatePost(updatePostRequest: UpdatePostRequest): Promise<PostDto> {
    return await clientCall(
      this.client.send<PostDto, UpdatePostRequest>('post.update', updatePostRequest).pipe(timeout(5000)),
    )
  }

  async deletePost(deletePostRequest: DeletePostRequest): Promise<DeletePostResponse> {
    return await clientCall(this.client.send<DeletePostResponse, DeletePostRequest>('post.delete', deletePostRequest))
  }
}
