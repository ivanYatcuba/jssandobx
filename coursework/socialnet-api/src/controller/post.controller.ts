import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common'
import { CreatePostResponse, ListPostsResponse, UserPostInput } from 'lib-core/src/dto/post.dto'
import { UserRequest } from 'src/dto/user.request.dto'
import { JwtDecodeGuard } from 'src/guard/jwt-decode.guard'
import { PostService } from 'src/service/post.service'

@UseGuards(JwtDecodeGuard)
@Controller('api/v1/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async createPost(@Body() userPostInput: UserPostInput, @Req() req: UserRequest): Promise<CreatePostResponse> {
    return await this.postService.createPost({ ...userPostInput, authorId: req.user.sub })
  }

  @Get('list')
  async listPost(
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
    @Query('authorId') authorId?: string,
  ): Promise<ListPostsResponse> {
    return await this.postService.listPosts({ authorId, offset, limit })
  }
}
