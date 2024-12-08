import { RpcException } from '@nestjs/microservices'

export class PostNotFound extends RpcException {
  constructor() {
    super({
      httpStatusCode: 404,
      message: 'Post not found',
    })
  }
}
