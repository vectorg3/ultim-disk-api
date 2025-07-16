import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RefreshToken, RefreshTokenSchema } from '@auth/schemas';
import { User, UserSchema } from '@shared/schemas';
import { AuthController } from '@auth/auth.controller';
import { AuthService } from '@auth/auth.service';
import { FileService } from '@shared/file';

@Module({
      imports: [
            MongooseModule.forFeature([
                  { name: User.name, schema: UserSchema },
                  {
                        name: RefreshToken.name,
                        schema: RefreshTokenSchema
                  }
            ])
      ],
      controllers: [AuthController],
      providers: [AuthService, FileService]
})
export class AuthModule {}
