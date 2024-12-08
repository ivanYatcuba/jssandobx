import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { MicroServiceExceptionFilter } from 'lib-core/dist/filter/exception.filter'
import { LoggingInterceptor } from 'lib-core/dist/interceptor/logging.interceptor'
import { DbConnection } from 'lib-core/dist/repository/db.connection'

import { UserController } from './controller/user.controller'
import { UserRepository } from './repository/user.repository'
import { UserService } from './service/user.service'

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [UserController],
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
    UserRepository,
    UserService,
  ],
})
export class AppModule {}
