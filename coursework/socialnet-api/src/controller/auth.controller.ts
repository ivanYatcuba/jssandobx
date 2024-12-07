import { Body, Controller, Headers, Post, Req, UseGuards } from '@nestjs/common'
import { LogoutResponse, RefreshTokenResponse, TokenResponse } from 'lib-core/src/dto/auth.dto'
import { UserCredentialsReq } from 'src/dto/request/auth.requests.dto'
import { UserRequest } from 'src/dto/user.request.dto'
import { JwtDecodeGuard } from 'src/guard/jwt-decode.guard'
import { AuthService } from 'src/service/auth.service'

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token')
  async token(
    @Body() userCredentials: UserCredentialsReq,
    @Headers('x-client-id') clientId: string,
  ): Promise<TokenResponse> {
    return await this.authService.token({ ...userCredentials, clientId })
  }

  @UseGuards(JwtDecodeGuard)
  @Post('refresh')
  async refreshToken(
    @Headers('authorization') refreshToken: string,
    @Req() req: UserRequest,
  ): Promise<RefreshTokenResponse> {
    return await this.authService.refresh({
      refreshToken: refreshToken.split('Bearer ')[1],
      clientId: req.user.clientId,
    })
  }

  @UseGuards(JwtDecodeGuard)
  @Post('logout')
  async logout(@Headers('authorization') accessToken: string, @Req() req: UserRequest): Promise<LogoutResponse> {
    return await this.authService.logout({
      accessToken: accessToken.split('Bearer ')[1],
      clientId: req.user.clientId,
      userId: req.user.sub,
    })
  }
}
