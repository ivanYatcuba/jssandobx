import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiHeader, ApiQuery, ApiResponse } from '@nestjs/swagger'
import { UserRequest } from 'src/dto/base.request.dto'
import { UserPostInputReq } from 'src/dto/request/post.requests.dto'
import { CreatePostResp, DeletePostResp, ListPostsResp, PostDtoResp } from 'src/dto/response/post.responses.dto'
import { JwtDecodeGuard } from 'src/guard/jwt-decode.guard'
import { PostService } from 'src/service/post.service'

@UseGuards(JwtDecodeGuard)
@Controller('api/v1/post')
@ApiBearerAuth()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiHeader({
    name: 'x-client-id',
    description: 'client identifier',
    required: true,
    schema: {
      example: 'test-client',
    },
  })
  @ApiResponse({ status: 201, type: CreatePostResp, description: 'Created post id' })
  async createPost(@Body() userPostInput: UserPostInputReq, @Req() req: UserRequest): Promise<CreatePostResp> {
    return await this.postService.createPost({ ...userPostInput, authorId: req.user.sub })
  }

  @Get('list')
  @ApiHeader({
    name: 'x-client-id',
    description: 'client identifier',
    required: true,
    schema: {
      example: 'test-client',
    },
  })
  @ApiResponse({ status: 200, type: ListPostsResp, description: 'List of posts' })
  @ApiQuery({ name: 'authorId', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 10 })
  @ApiQuery({ name: 'offset', required: false, type: Number, default: 0 })
  async listPost(
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
    @Query('authorId') authorId?: string,
  ): Promise<ListPostsResp> {
    return await this.postService.listPosts({ authorId, offset, limit })
  }

  @Get(':postId')
  @ApiHeader({
    name: 'x-client-id',
    description: 'client identifier',
    required: true,
    schema: {
      example: 'test-client',
    },
  })
  @ApiResponse({ status: 200, type: PostDtoResp, description: 'Post details' })
  async getPost(@Param('postId') postId: string): Promise<ListPostsResp> {
    return await this.postService.getPost({ postId })
  }

  @Put(':postId')
  @ApiHeader({
    name: 'x-client-id',
    description: 'client identifier',
    required: true,
    schema: {
      example: 'test-client',
    },
  })
  @ApiResponse({ status: 200, type: PostDtoResp, description: 'Updated post details' })
  async updatePost(
    @Param('postId') postId: string,
    @Body() userPostInput: UserPostInputReq,
    @Req() req: UserRequest,
  ): Promise<PostDtoResp> {
    return await this.postService.updatePost({ postId, authorId: req.user.sub, content: userPostInput.content })
  }

  @Delete(':postId')
  @ApiHeader({
    name: 'x-client-id',
    description: 'client identifier',
    required: true,
    schema: {
      example: 'test-client',
    },
  })
  @ApiResponse({ status: 200, type: DeletePostResp, description: 'Deleted post id' })
  async deletePost(@Param('postId') postId: string, @Req() req: UserRequest): Promise<DeletePostResp> {
    return await this.postService.deletePost({ postId, authorId: req.user.sub })
  }
}
