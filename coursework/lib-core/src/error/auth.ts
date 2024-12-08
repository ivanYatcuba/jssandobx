import { RpcException } from '@nestjs/microservices'

export class UserWrongLoginOrPassError extends RpcException {
  constructor() {
    super({
      httpStatusCode: 401,
      message: 'Wrong user credentials',
    })
  }
}
