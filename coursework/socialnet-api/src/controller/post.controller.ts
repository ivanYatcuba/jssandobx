import { Controller, UseGuards } from '@nestjs/common'
import { JwtDecodeGuard } from 'src/guard/jwt-decode.guard'
import { PostService } from 'src/service/post.service'

@UseGuards(JwtDecodeGuard)
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}
}
