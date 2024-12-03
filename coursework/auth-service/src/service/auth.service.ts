import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import {
  LogoutRequest,
  LogoutResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  TokenRequest,
  TokenResponse,
} from 'src/dto/auth'
import { TokensRepository } from 'src/repository/tokens.repository'

import { UserService } from './user.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly tokensService: TokensRepository,
    private readonly userService: UserService,
  ) {}

  async token(tokenRequest: TokenRequest): Promise<TokenResponse> {
    const { login, password, clientId } = tokenRequest

    const { uid } = await this.userService.validateUser({ login, password })

    const payload = { login, sub: uid }
    const accessToken = this.jwtService.sign(payload, { expiresIn: process.env.JWT_AUTH_TOKEN_EXIRE })
    const refreshToken = this.jwtService.sign(payload, { expiresIn: process.env.JWT_RESRESH_TOKEN_EXIRE })

    await this.tokensService.saveTokens(uid, clientId, accessToken, refreshToken)

    return {
      accessToken,
      refreshToken,
    }
  }

  async refreshAccessToken(refreshTokenRequest: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const { refreshToken, clientId } = refreshTokenRequest

    let decodedToken: { username: string; sub: string }
    try {
      decodedToken = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      })
    } catch (e) {
      throw new Error('Invalid or expired refresh token')
    }

    const storedToken = await this.tokensService.findRefreshToken(refreshToken, clientId)
    if (!storedToken) {
      throw new Error('Refresh token not found')
    }

    const newAccessToken = this.jwtService.sign(
      { username: decodedToken.username, sub: decodedToken.sub },
      { expiresIn: process.env.JWT_AUTH_TOKEN_EXIRE, secret: process.env.JWT_SECRET },
    )

    await this.tokensService.saveTokens(decodedToken.sub, clientId, newAccessToken, refreshToken)

    return { accessToken: newAccessToken }
  }

  async logout(logoutRequest: LogoutRequest): Promise<LogoutResponse> {
    const { accessToken, clientId } = logoutRequest

    await this.tokensService.deleteAccessToken(accessToken, clientId)

    return {}
  }
}
