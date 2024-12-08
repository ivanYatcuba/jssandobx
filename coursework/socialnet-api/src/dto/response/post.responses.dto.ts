import { ApiProperty } from '@nestjs/swagger'
import { CreatePostResponse, DeletePostResponse, ListPostsResponse, PostDto } from 'lib-core/dist/dto/post.dto'

export class CreatePostResp implements CreatePostResponse {
  @ApiProperty()
  postId: string
}

export class PostDtoResp implements PostDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  content: string

  @ApiProperty()
  author: string

  @ApiProperty()
  date: Date
}

export class ListPostsResp implements ListPostsResponse {
  @ApiProperty({ isArray: true, type: PostDtoResp })
  posts: PostDtoResp[]
}

export class DeletePostResp implements DeletePostResponse {
  @ApiProperty()
  postId: string
}
