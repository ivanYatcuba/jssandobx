import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

import { AppModule } from './app.module'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBIT_CONNECTION],
      queue: 'post.service',
      queueOptions: {
        durable: false,
      },
    },
  })

  await app.listen()
}

bootstrap()
