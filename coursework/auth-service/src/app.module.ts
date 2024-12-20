import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { MicroServiceExceptionFilter } from 'lib-core/dist/filter/exception.filter'
import { LoggingInterceptor } from 'lib-core/dist/interceptor/logging.interceptor'
import { DbConnection } from 'lib-core/dist/repository/db.connection'

import { AuthController } from './controller/auth.controller'
import { TokensRepository } from './repository/tokens.repository'
import { AuthService } from './service/auth.service'
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
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
    }),
  ],
  controllers: [AuthController],
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
    TokensRepository,
    AuthService,
    UserService,
  ],
})
export class AppModule {}
