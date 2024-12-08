import { MiddlewareConsumer, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { AuthController } from 'src/controller/auth.controller'
import { PostController } from 'src/controller/post.controller'
import { UserController } from 'src/controller/user.controller'
import { LoggerMiddleware } from 'src/middleware/logger.middleware'
import { AuthService } from 'src/service/auth.service'
import { PostService } from 'src/service/post.service'
import { UserService } from 'src/service/user.service'

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
    }),
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
      {
        name: 'AUTH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBIT_CONNECTION],
          queue: 'auth.service',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'POST_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBIT_CONNECTION],
          queue: 'post.service',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [AuthController, UserController, PostController],
  providers: [AuthService, UserService, PostService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
