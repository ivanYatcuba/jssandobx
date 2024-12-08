import { Body, Controller, Headers, HttpCode, Post, Req, UseGuards } from '@nestjs/common'
import { ApiHeader, ApiHeaders, ApiResponse } from '@nestjs/swagger'
import { UserRequest } from 'src/dto/base.request.dto'
import { UserCredentialsReq } from 'src/dto/request/auth.requests.dto'
import { LogoutResp, RefreshTokenRes, TokenRes } from 'src/dto/response/auth.responses.dto'
import { JwtDecodeGuard } from 'src/guard/jwt-decode.guard'
import { AuthService } from 'src/service/auth.service'

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token')
  @ApiHeader({
    name: 'x-client-id',
    description: 'client identifier',
    required: true,
    schema: {
      example: 'test-client',
    },
  })
  @HttpCode(200)
  @ApiResponse({ status: 200, type: TokenRes, description: 'Returns access and refresh tokens' })
  async token(
    @Body() userCredentials: UserCredentialsReq,
    @Headers('x-client-id') clientId: string,
  ): Promise<TokenRes> {
    return await this.authService.token({ ...userCredentials, clientId })
  }

  @UseGuards(JwtDecodeGuard)
  @Post('refresh')
  @ApiHeaders([
    {
      name: 'x-client-id',
      description: 'client identifier',
      required: true,
      schema: {
        example: 'test-client',
      },
    },
    {
      name: 'authorization',
      required: true,
      description: 'refresh token',
    },
  ])
  @HttpCode(200)
  @ApiResponse({ status: 200, type: TokenRes, description: 'Returns refreshed access' })
  async refreshToken(
    @Headers('authorization') refreshToken: string,
    @Req() req: UserRequest,
  ): Promise<RefreshTokenRes> {
    return await this.authService.refresh({
      refreshToken: refreshToken.split('Bearer ')[1],
      clientId: req.user.clientId,
    })
  }

  @UseGuards(JwtDecodeGuard)
  @Post('logout')
  @ApiHeaders([
    {
      name: 'x-client-id',
      description: 'client identifier',
      required: true,
      schema: {
        example: 'test-client',
      },
    },
    {
      name: 'authorization',
      required: true,
      description: 'access token',
    },
  ])
  @HttpCode(200)
  @ApiResponse({ status: 200, type: LogoutResp, description: 'Logout success message' })
  async logout(@Headers('authorization') accessToken: string, @Req() req: UserRequest): Promise<LogoutResp> {
    return await this.authService.logout({
      accessToken: accessToken.split('Bearer ')[1],
      clientId: req.user.clientId,
      userId: req.user.sub,
    })
  }
}
