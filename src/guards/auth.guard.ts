import {
      CanActivate,
      ExecutionContext,
      Injectable,
      Logger,
      UnauthorizedException
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { RequestWithUserId } from '../models';

@Injectable()
export class AuthGuard implements CanActivate {
      constructor(private readonly jwtService: JwtService) {}

      canActivate(
            context: ExecutionContext
      ): boolean | Promise<boolean> | Observable<boolean> {
            const request: RequestWithUserId = context
                  .switchToHttp()
                  .getRequest();
            const token = this.extractTokenFromHeader(request);
            if (!token) throw new UnauthorizedException('Неправильный токен');
            try {
                  const payload: { userId: string } =
                        this.jwtService.verify(token);
                  request.userId = payload.userId;
            } catch (e) {
                  Logger.error(e);
                  throw new UnauthorizedException('Неправильный токен');
            }
            return true;
      }

      private extractTokenFromHeader(request: Request): string | undefined {
            return request.headers.authorization?.split(' ')[1];
      }
}
