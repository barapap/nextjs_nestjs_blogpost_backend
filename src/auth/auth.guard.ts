import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly jwtSecret = "test123";

  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    console.log('Authorization Header:', authHeader);

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token missing');
    }

    try {
      console.log('Token to Verify:', token);
      const user = this.jwtService.verify(
        token,
        {secret: this.jwtSecret}
      );
      console.log('Decoded User:', user);
      request.user = user;
      return true;
    } catch (error) {
      console.log('Verification Error at auth.guard: ', error);
      throw new UnauthorizedException('hereee Invalid token');
    }
  }
}
