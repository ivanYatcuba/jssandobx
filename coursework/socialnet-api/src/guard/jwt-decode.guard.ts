import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserRequest, UserSessionDto } from 'src/dto/user.request.dto'
import { AuthService } from 'src/service/auth.service'

@Injectable()
export class JwtDecodeGuard {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid token')
    }

    const token = authHeader.split(' ')[1]

    // todo more elegant way to detect token type
    return await this.decodeToken(token, request, request.path === '/api/v1/auth/refresh')
  }

  private async decodeToken(token: string, request: UserRequest, isTokenRefreshing: boolean): Promise<boolean> {
    let decoded: UserSessionDto
    try {
      decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      })
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token')
    }

    const clientId = request.headers['x-client-id']
    if (!clientId) {
      throw new UnauthorizedException('Client id must be present to authorize your request')
    }

    try {
      await this.authService.checkTokenExists({
        accessToken: token,
        clientId,
        userId: decoded.sub,
        isTokenRefreshing,
      })
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired token')
    }

    request.user = { ...decoded, clientId }

    return true
  }
}
