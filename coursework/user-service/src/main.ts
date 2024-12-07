import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { JsonLoggerService } from 'json-logger-service'

import { AppModule } from './app.module'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    logger: new JsonLoggerService('user-service'),
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBIT_CONNECTION],
      queue: 'user.service',
      queueOptions: {
        durable: false,
      },
    },
  })

  await app.listen()
}

bootstrap()
