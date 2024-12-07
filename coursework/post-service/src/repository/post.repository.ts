import { Injectable } from '@nestjs/common'
import { DbConnection } from 'lib-core/dist/repository/db.connection'

import { SelectPostRow } from './rows'

@Injectable()
export class PostRepository {
  constructor(private readonly dbConnection: DbConnection) {}

  async createPost(postContent: string, authorId: string): Promise<string> {
    const res = await this.dbConnection
      .getDbConnectionPool()
      .query('INSERT INTO posts (content, author) VALUES ($1, $2) RETURNING uid;', [postContent, authorId])

    return res.rows[0].uid
  }

  async getPosts(limit: number, offset: number, authorId?: string): Promise<SelectPostRow[]> {
    let selectArgs: unknown[]
    let selectQuery = 'SELECT uid, content, author, createdAt, updatedAt FROM posts'

    if (authorId && authorId !== '') {
      selectQuery += ' WHERE authorId = $1 LIMIT $2 OFFSET $3;'
      selectArgs = [authorId, limit, offset]
    } else {
      selectQuery += ' LIMIT $1 OFFSET $2;'
      selectArgs = [limit, offset]
    }

    const res = await this.dbConnection.getDbConnectionPool().query(selectQuery, selectArgs)

    return res.rows
  }

  async getPost(postId: string): Promise<SelectPostRow> {
    const res = await this.dbConnection
      .getDbConnectionPool()
      .query('SELECT uid, content, author, createdAt, updatedAt FROM posts WHERE uid = $1 LIMIT 1', [postId])

    return res.rows[0]
  }

  async updatePost(postId: string, content: string, author: string): Promise<SelectPostRow> {
    const res = await this.dbConnection
      .getDbConnectionPool()
      .query(
        'UPDATE posts SET content = $2, updatedAt = now() WHERE uid = $1 AND author = $3 RETURNING uid, content, author, createdAt, updatedAt',
        [postId, content, author],
      )

    return res.rows[0]
  }

  async deletePost(postId: string, author: string): Promise<string> {
    const res = await this.dbConnection
      .getDbConnectionPool()
      .query('DELETE FROM posts WHERE uid = $1 AND author = $2 RETURNING uid', [postId, author])

    return res.rows[0].uid
  }
}
