import { Injectable } from '@nestjs/common';
import { CreateUserDto, UserInfoWithPass } from 'src/dto/user.dto';

import { DbConnection } from './db.connection';

@Injectable()
export class UserRepository {
  constructor(private readonly dbConnection: DbConnection) {}

  async createUser(user: CreateUserDto): Promise<string> {
    const { login, email, password } = user;

    const res = await this.dbConnection
      .getDbConnectionPool()
      .query(
        'INSERT INTO users (login, email, password) VALUES ($1, $2, $3) RETURNING uid;',
        [login, email, password],
      );

    return res.rows[0];
  }

  async getUserById(id: string): Promise<UserInfoWithPass> {
    const res = await this.dbConnection
      .getDbConnectionPool()
      .query(
        'SELECT email, login, password, createdAt FROM users WHERE id = ?',
        [id],
      );

    return <UserInfoWithPass>res.rows[0];
  }
}
