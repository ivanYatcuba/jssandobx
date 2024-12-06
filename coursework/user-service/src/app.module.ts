import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DbConnection } from 'lib-core/dist/repository/db.connection'

import { UserController } from './controller/user.controller'
import { UserRepository } from './repository/user.repository'
import { UserService } from './service/user.service'

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [UserController],
  providers: [DbConnection, UserRepository, UserService],
})
export class AppModule {}
