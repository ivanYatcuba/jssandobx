import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom, timeout } from 'rxjs'
import { UserInfo, UserValidateRequest } from 'src/dto/user'

@Injectable()
export class UserService {
  constructor(@Inject('USER_SERVICE') private readonly client: ClientProxy) {}

  async validateUser(validateRequest: UserValidateRequest): Promise<UserInfo> {
    return await firstValueFrom(
      this.client.send<UserInfo, UserValidateRequest>('user.validate', validateRequest).pipe(timeout(5000)),
    )
  }
}
