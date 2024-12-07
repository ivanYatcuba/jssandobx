import { Catch, RpcExceptionFilter } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { JsonLogger, LoggerFactory } from 'json-logger-service'
import { Observable, throwError } from 'rxjs'

@Catch(RpcException)
export class MicroServiceExceptionFilter implements RpcExceptionFilter<RpcException> {
  private readonly logger: JsonLogger = LoggerFactory.createLogger(MicroServiceExceptionFilter.name)

  catch(exception: RpcException): Observable<unknown> {
    this.logger.error('service produced error', JSON.stringify(exception))

    return throwError(() => exception)
  }
}
