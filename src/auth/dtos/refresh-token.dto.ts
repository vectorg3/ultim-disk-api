import { IsString } from 'class-validator';

export class RefreshTokenDto {
      @IsString({ message: 'Вы не указали токен' })
      refreshToken: string;
}
