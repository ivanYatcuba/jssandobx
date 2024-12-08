import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common'
import { JsonLogger, LoggerFactory } from 'json-logger-service'
import { Observable, tap } from 'rxjs'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger: JsonLogger = LoggerFactory.createLogger(LoggingInterceptor.name)

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToRpc().getContext()

    this.logger.info({ request: context.getArgs()[0] }, `received request: ${ctx.getPattern()}`)

    const now: number = Date.now()

    return next
      .handle()
      .pipe(
        tap((resp) => this.logger.info({ response: resp }, `done request: ${ctx.getPattern()} ${Date.now() - now}ms`)),
      )
  }
}
