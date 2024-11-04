import { Controller } from '@nestjs/common';
import { PostService } from 'src/service/post.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}
}
