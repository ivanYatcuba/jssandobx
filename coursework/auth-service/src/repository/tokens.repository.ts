import { Injectable } from '@nestjs/common'

import { DbConnection } from './db.connection'

@Injectable()
export class TokensRepository {
  constructor(private readonly dbConnection: DbConnection) {}

  async saveTokens(userId: string, clientId: string, accessToken: string, refreshToken: string): Promise<void> {
    await this.dbConnection
      .getDbConnectionPool()
      .query(
        'INSERT INTO tokens (userId, accessToken, refreshToken, clientId) VALUES ($1, $2, $3, $4) ON CONFLICT (userId, clientId) DO UPDATE SET accessToken = $2, refreshToken = $3 ',
        [userId, accessToken, refreshToken, clientId],
      )
  }

  async findAccessToken(accessToken: string): Promise<any> {
    const result = await this.dbConnection
      .getDbConnectionPool()
      .query('SELECT * FROM tokens WHERE access_token = $1', [accessToken])

    return result.rows[0]
  }

  async findRefreshToken(refreshToken: string, clientId: string): Promise<any> {
    const result = await this.dbConnection
      .getDbConnectionPool()
      .query('SELECT userId FROM tokens WHERE refreshToken = $1 AND clientId = $2', [refreshToken, clientId])

    return result.rows[0]
  }

  async deleteAccessToken(accessToken: string, clientId: string): Promise<void> {
    await await this.dbConnection
      .getDbConnectionPool()
      .query('DELETE FROM tokens WHERE accessToken = $1 AND clientId = $2', [accessToken, clientId])
  }

  async deleteRefreshToken(refreshToken: string): Promise<void> {
    await await this.dbConnection
      .getDbConnectionPool()
      .query('DELETE FROM tokens WHERE refresh_token = $1', [refreshToken])
  }

  async deleteTokensByUserId(userId: number): Promise<void> {
    await await this.dbConnection.getDbConnectionPool().query('DELETE FROM tokens WHERE user_id = $1', [userId])
  }
}
