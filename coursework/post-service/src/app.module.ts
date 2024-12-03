import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PostService } from 'src/service/post.service'

import { PostController } from './controller/post.controller'
import { DbConnection } from './repository/db.connection'
import { PostRepository } from './repository/post.repository'

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [PostController],
  providers: [DbConnection, PostRepository, PostService],
})
export class AppModule {}
