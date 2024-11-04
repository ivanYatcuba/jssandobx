import { Module } from '@nestjs/common';
import { AuthController } from 'src/controller/auth.controller';
import { PostController } from 'src/controller/post.controller';
import { UserController } from 'src/controller/user.controller';
import { AuthService } from 'src/service/auth.service';
import { PostService } from 'src/service/post.service';
import { UserService } from 'src/service/user.service';

@Module({
  imports: [],
  controllers: [AuthController, UserController, PostController],
  providers: [AuthService, UserService, PostService],
})
export class AppModule {}
