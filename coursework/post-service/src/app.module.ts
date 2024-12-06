import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { DbConnection } from 'lib-core/dist/repository/db.connection'
import { PostService } from 'src/service/post.service'

import { PostController } from './controller/post.controller'
import { PostRepository } from './repository/post.repository'
import { UserService } from './service/user.service'

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBIT_CONNECTION],
          queue: 'user.service',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [PostController],
  providers: [DbConnection, PostRepository, PostService, UserService],
})
export class AppModule {}
