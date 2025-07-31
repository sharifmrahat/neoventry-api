// src/common/guards/jwt-auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UserPayload } from 'src/interfaces/user-context';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request?.headers?.authorization;

    if (isPublic) return true;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token is required');
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = this.jwtService.verify(token) as UserPayload;
      request.user = payload;
    } catch (err) {
      throw new UnauthorizedException(
        err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token',
      );
    }

    return true;
  }
}
