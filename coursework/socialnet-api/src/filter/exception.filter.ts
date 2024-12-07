import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { IRpcException } from 'lib-core/dist/error/common'

@Catch()
export class GatewayExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GatewayExceptionFilter.name)

  catch(exception: Error | HttpException | RpcException, host: ArgumentsHost): void {
    this.logger.error(exception)

    if (exception instanceof HttpException) {
      return host.switchToHttp().getResponse().status(exception.getStatus()).json(exception.getResponse())
    }

    let statusCode: number
    let message: string

    if ('error' in exception) {
      statusCode = (<IRpcException>exception.getError()).httpStatusCode ?? 500
      message = (<IRpcException>exception.getError()).message ?? 'Unexpected error occurred'
    }

    return host.switchToHttp().getResponse().status(statusCode).json({
      message,
    })
  }
}
