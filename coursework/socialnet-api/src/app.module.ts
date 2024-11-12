import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from 'src/controller/auth.controller';
import { PostController } from 'src/controller/post.controller';
import { UserController } from 'src/controller/user.controller';
import { LocalStrategy } from 'src/guard/local.strategy';
import { AuthService } from 'src/service/auth.service';
import { PostService } from 'src/service/post.service';
import { UserService } from 'src/service/user.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rmuser:rmpassword@localhost:15672'],
          queue: 'user.service',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [AuthController, UserController, PostController],
  providers: [LocalStrategy, AuthService, UserService, PostService],
})
export class AppModule {}
