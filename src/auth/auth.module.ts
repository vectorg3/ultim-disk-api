import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FileService, User, UserSchema } from '../shared';
import { MongooseModule } from '@nestjs/mongoose';
import { RefreshToken, RefreshTokenSchema } from './schemas';

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
