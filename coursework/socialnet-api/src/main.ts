import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { GatewayExceptionFilter } from 'src/filter/exception.filter'

import { AppModule } from './app.module'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalFilters(new GatewayExceptionFilter())
  await app.listen(3000)
}

bootstrap()
