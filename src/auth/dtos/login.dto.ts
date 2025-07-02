import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
      @ApiProperty({ default: 'testUser@gmail.com' })
      @IsNotEmpty({ message: 'Вы не указали почту' })
      email: string;

      @ApiProperty({ default: '123456' })
      @IsNotEmpty({ message: 'Вы не указали пароль' })
      password: string;
}
