import { Injectable } from '@nestjs/common'
import { DbConnection } from 'lib-core/dist/repository/db.connection'

import { TokenUserIdRow } from './rows'

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

  async findToken(
    accessToken: string,
    clientId: string,
    userId: string,
    isTokenRefreshing: boolean,
  ): Promise<TokenUserIdRow> {
    const query = `SELECT userId FROM tokens WHERE ${isTokenRefreshing ? 'refreshToken' : 'accessToken'} = $1 AND userId = $2 AND clientId = $3`
    const result = await this.dbConnection.getDbConnectionPool().query(query, [accessToken, userId, clientId])

    return result.rows[0]
  }

  async findRefreshToken(refreshToken: string, clientId: string): Promise<TokenUserIdRow> {
    const result = await this.dbConnection
      .getDbConnectionPool()
      .query('SELECT userId FROM tokens WHERE refreshToken = $1 AND clientId = $2', [refreshToken, clientId])

    return result.rows[0]
  }

  async deleteAccessToken(accessToken: string, clientId: string, userId: string): Promise<void> {
    await this.dbConnection
      .getDbConnectionPool()
      .query('DELETE FROM tokens WHERE accessToken = $1 AND clientId = $2 AND userId = $3', [
        accessToken,
        clientId,
        userId,
      ])
  }
}
