import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { GetUserNamesRequest, GetUserNamesResponse } from 'lib-core/src/dto/user.dto'
import { firstValueFrom, timeout } from 'rxjs'

@Injectable()
export class UserService {
  constructor(@Inject('USER_SERVICE') private readonly client: ClientProxy) {}

  async getUsernames(getUserNamesRequest: GetUserNamesRequest): Promise<GetUserNamesResponse> {
    return await firstValueFrom(
      this.client
        .send<GetUserNamesResponse, GetUserNamesRequest>('user.names', getUserNamesRequest)
        .pipe(timeout(5000)),
    )
  }
}
