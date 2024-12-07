import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { clientCall } from 'lib-core/dist/client/util'
import { GetUserNamesRequest, GetUserNamesResponse } from 'lib-core/src/dto/user.dto'

@Injectable()
export class UserService {
  constructor(@Inject('USER_SERVICE') private readonly client: ClientProxy) {}

  async getUsernames(getUserNamesRequest: GetUserNamesRequest): Promise<GetUserNamesResponse> {
    return await clientCall(
      this.client.send<GetUserNamesResponse, GetUserNamesRequest>('user.names', getUserNamesRequest),
    )
  }
}
