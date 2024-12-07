import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator'
import { CreateUserDto } from 'lib-core/dist/dto/user.dto'

export class CreateUserReq implements CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  @Length(5, 30)
  login: string

  @IsNotEmpty()
  @IsString()
  @Length(8, 120)
  password: string
}
