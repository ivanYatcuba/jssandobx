import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { OpenAPIObject } from '@nestjs/swagger/dist/interfaces'
import { GatewayExceptionFilter } from 'src/filter/exception.filter'

import { AppModule } from './app.module'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalFilters(new GatewayExceptionFilter())

  const config = new DocumentBuilder()
    .setTitle('SocialNet API')
    .setDescription('API to share useful posts')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
      name: 'Authorization',
      description: 'Enter your Bearer token',
    })
    .build()
  const documentFactory = (): OpenAPIObject => SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('api', app, documentFactory)

  await app.listen(3000)
}

bootstrap()
