import { Injectable } from '@nestjs/common'

import { DbConnection } from './db.connection'

@Injectable()
export class PostRepository {
  constructor(private readonly dbConnection: DbConnection) {}

  async createPost(postContent: string, authorId: string): Promise<string> {
    const res = await this.dbConnection
      .getDbConnectionPool()
      .query('INSERT INTO posts (content, author) VALUES ($1, $2) RETURNING uid;', [postContent, authorId])

    return res.rows[0]
  }
}
