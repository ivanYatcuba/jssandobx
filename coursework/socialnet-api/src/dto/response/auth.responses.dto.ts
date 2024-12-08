import { ApiProperty } from '@nestjs/swagger'
import { LogoutResponse, RefreshTokenResponse, TokenResponse } from 'lib-core/dist/dto/auth.dto'

export class TokenRes implements TokenResponse {
  @ApiProperty()
  accessToken: string

  @ApiProperty()
  refreshToken: string
}

export class RefreshTokenRes implements RefreshTokenResponse {
  @ApiProperty()
  accessToken: string
}

export class LogoutResp implements LogoutResponse {
  @ApiProperty()
  success: boolean
}
