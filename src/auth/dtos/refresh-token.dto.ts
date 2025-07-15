import { IsString } from 'class-validator';

export class RefreshTokenDto {
      @IsString({ message: 'Token not found' })
      refreshToken: string;
}
