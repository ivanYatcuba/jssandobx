import { CacheModule, CacheStore } from '@nestjs/cache-manager'
import { Logger, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { redisStore } from 'cache-manager-redis-store'
import { MicroServiceExceptionFilter } from 'lib-core/dist/filter/exception.filter'
import { LoggingInterceptor } from 'lib-core/dist/interceptor/logging.interceptor'
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
    CacheModule.registerAsync({
      useFactory: async () => {
        const store = await redisStore({
          url: process.env.REDIS_CONNECTION,
        })

        return {
          store: <CacheStore>(<unknown>store),
        }
      },
    }),
  ],
  controllers: [PostController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: MicroServiceExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    DbConnection,
    PostRepository,
    PostService,
    UserService,
    Logger,
  ],
})
export class AppModule {}
