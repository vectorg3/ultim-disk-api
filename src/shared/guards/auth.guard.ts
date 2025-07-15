import {
      CanActivate,
      ExecutionContext,
      Injectable,
      UnauthorizedException
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
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
            if (!token) throw new UnauthorizedException('Invalid token');
            try {
                  const payload: { userId: string } =
                        this.jwtService.verify(token);
                  request.userId = payload.userId;
            } catch (e) {
                  if (e instanceof TokenExpiredError)
                        throw new UnauthorizedException('Token expired');
                  throw new UnauthorizedException('Invalid token');
            }
            return true;
      }

      private extractTokenFromHeader(request: Request): string | undefined {
            return request.headers.authorization?.split(' ')[1];
      }
}
