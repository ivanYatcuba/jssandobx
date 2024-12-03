import { Injectable } from '@nestjs/common'
import { Pool } from 'pg'

@Injectable()
export class DbConnection {
  private readonly pool = new Pool({
    connectionString: process.env.DB_CONNECTION,
  })

  getDbConnectionPool(): Pool {
    return this.pool
  }
}
