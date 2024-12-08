import { RpcException } from '@nestjs/microservices'

export class UsernameAlreadyExists extends RpcException {
  constructor() {
    super({
      httpStatusCode: 409,
      message: 'User already exists',
    })
  }
}
