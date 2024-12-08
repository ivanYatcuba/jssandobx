import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger: Logger = new Logger(LoggerMiddleware.name)

  use(request: Request, response: Response, next: NextFunction) {
    const { ip, method, originalUrl } = request
    const userAgent = request.get('user-agent') || ''

    this.logger.log(`${method} ${originalUrl} - ${userAgent} ${ip}`)

    response.on('finish', () => {
      const { statusCode } = response
      const contentLength = response.get('content-length')

      this.logger.log(`${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`)
    })

    next()
  }
}
