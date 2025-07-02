import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
      @ApiProperty({ default: 'testUser' })
      @IsNotEmpty({ message: 'Вы не указали имя пользователя' })
      name: string;
      @ApiProperty({ default: 'testUser@gmail.com' })
      @IsEmail({}, { message: 'Некорректный адрес электронной почты' })
      email: string;
      @ApiProperty({ default: '123456' })
      @IsNotEmpty({ message: 'Вы не указали пароль' })
      @MinLength(6, {
            message: 'Минимальная длина пароля составляет 6 символов'
      })
      password: string;
}
