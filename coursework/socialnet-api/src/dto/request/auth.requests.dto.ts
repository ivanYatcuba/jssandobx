import { IsNotEmpty, IsString, Length } from 'class-validator'
import { UserCredentials } from 'lib-core/dist/dto/user.dto'

export class UserCredentialsReq implements UserCredentials {
  @IsNotEmpty()
  @IsString()
  @Length(5, 30)
  login: string

  @IsNotEmpty()
  @IsString()
  @Length(8, 120)
  password: string
}
