import { Injectable } from '@nestjs/common'
import { CreateUserDto, UserInfoWithPass } from 'src/dto/user.dto'

import { DbConnection } from './db.connection'

@Injectable()
export class UserRepository {
  constructor(private readonly dbConnection: DbConnection) {}

  async createUser(user: CreateUserDto): Promise<string> {
    const { login, email, password } = user

    const res = await this.dbConnection
      .getDbConnectionPool()
      .query('INSERT INTO users (login, email, password) VALUES ($1, $2, $3) RETURNING uid;', [login, email, password])

    return res.rows[0]
  }

  async getUserByUsernameOrEmail(loginName: string): Promise<UserInfoWithPass> {
    const result = await this.dbConnection
      .getDbConnectionPool()
      .query('SELECT uid, email, login, password FROM users WHERE login = $1 OR email = $1', [loginName])

    const res = result.rows[0]
    const pass = res.password.toString('utf-8')

    delete res.password

    return { ...res, password: pass }
  }

  async getUserById(id: string): Promise<UserInfoWithPass> {
    const res = await this.dbConnection
      .getDbConnectionPool()
      .query('SELECT email, login, password, createdAt FROM users WHERE id = ?', [id])

    return <UserInfoWithPass>res.rows[0]
  }
}
