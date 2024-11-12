import { Module } from '@nestjs/common';

import { UserController } from './controller/user.controller';
import { DbConnection } from './repository/db.connection';
import { UserRepository } from './repository/user.repository';
import { UserService } from './service/user.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [DbConnection, UserRepository, UserService],
})
export class AppModule {}
