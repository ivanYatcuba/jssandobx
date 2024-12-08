import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import {
  CheckTokenExistsRequest,
  CheckTokenExistsResponse,
  LogoutRequest,
  LogoutResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  TokenRequest,
  TokenResponse,
} from 'lib-core/src/dto/auth.dto'
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
      throw new UnauthorizedException('Invalid or expired refresh token')
    }

    const storedToken = await this.tokensService.findRefreshToken(refreshToken, clientId)
    if (!storedToken) {
      throw new UnauthorizedException('Refresh token not found')
    }

    const newAccessToken = this.jwtService.sign(
      { username: decodedToken.username, sub: decodedToken.sub },
      { expiresIn: process.env.JWT_AUTH_TOKEN_EXIRE, secret: process.env.JWT_SECRET },
    )

    await this.tokensService.saveTokens(decodedToken.sub, clientId, newAccessToken, refreshToken)

    return { accessToken: newAccessToken }
  }

  async logout(logoutRequest: LogoutRequest): Promise<LogoutResponse> {
    const { accessToken, clientId, userId } = logoutRequest

    await this.tokensService.deleteAccessToken(accessToken, clientId, userId)

    return { success: true }
  }

  async checkTokenExists(logoutRequest: CheckTokenExistsRequest): Promise<CheckTokenExistsResponse> {
    const { accessToken, clientId, userId, isTokenRefreshing } = logoutRequest

    const existingRow = await this.tokensService.findToken(accessToken, clientId, userId, isTokenRefreshing)

    if (!existingRow) {
      throw new UnauthorizedException('Token does not exists')
    }

    return {
      exists: true,
    }
  }
}
