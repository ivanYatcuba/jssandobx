import { Injectable } from '@nestjs/common'
import { Pool } from 'pg'

@Injectable()
export class DbConnection {
  private readonly pool = new Pool({
    connectionString: 'postgres://dev:112233@localhost:5444/sn_db',
  })

  getDbConnectionPool(): Pool {
    return this.pool
  }
}
