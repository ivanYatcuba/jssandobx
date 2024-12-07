import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { clientCall } from 'lib-core/dist/client/util'
import { UserInfo, UserValidateRequest } from 'lib-core/dist/dto/user.dto'

@Injectable()
export class UserService {
  constructor(@Inject('USER_SERVICE') private readonly client: ClientProxy) {}

  async validateUser(validateRequest: UserValidateRequest): Promise<UserInfo> {
    return clientCall(this.client.send<UserInfo, UserValidateRequest>('user.validate', validateRequest))
  }
}
