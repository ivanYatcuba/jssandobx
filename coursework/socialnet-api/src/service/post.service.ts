import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { CreatePostRequest, CreatePostResponse, ListPostsRequest, ListPostsResponse } from 'lib-core/dist/dto/post.dto'
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
}
