import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dtos/login.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

@ApiTags('AuthController')
@Controller('auth')
export class AuthController {
      constructor(private readonly authService: AuthService) {}

      @Post('signup')
      @ApiOperation({ summary: 'Регистрация пользователя' })
      @ApiBody({ type: SignupDto })
      async signUp(@Body() body: SignupDto) {
            return this.authService.signUp(body);
      }

      @Post('login')
      @ApiOperation({ summary: 'Авторизация пользователя' })
      @ApiBody({ type: LoginDto })
      async login(@Body() body: LoginDto) {
            return this.authService.login(body);
      }

      @Post('refresh')
      @ApiOperation({ summary: 'Обновить токены' })
      @ApiBody({ type: RefreshTokenDto })
      async refreshTokens(@Body() refreshToken: RefreshTokenDto) {
            return this.authService.refreshTokens(refreshToken.refreshToken);
      }
}
