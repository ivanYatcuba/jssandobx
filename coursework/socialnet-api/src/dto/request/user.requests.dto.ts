import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator'
import { CreateUserDto } from 'lib-core/dist/dto/user.dto'

export class CreateUserReq implements CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty()
  @ApiProperty({ default: 'test1@mail.com', required: true })
  email: string

  @IsNotEmpty()
  @IsString()
  @Length(5, 30)
  @ApiProperty()
  @ApiProperty({ default: 'newMe1', required: true })
  login: string

  @IsNotEmpty()
  @IsString()
  @Length(8, 120)
  @ApiProperty()
  @ApiProperty({ default: 'qwerty12345', required: true })
  password: string
}
