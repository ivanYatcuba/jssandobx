import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, Length } from 'class-validator'
import { UserCredentials } from 'lib-core/dist/dto/user.dto'

export class UserCredentialsReq implements UserCredentials {
  @IsNotEmpty()
  @IsString()
  @Length(5, 30)
  @ApiProperty({ default: 'newMe1', required: true })
  login: string

  @IsNotEmpty()
  @IsString()
  @Length(8, 120)
  @ApiProperty({ default: 'qwerty12345', required: true })
  password: string
}
