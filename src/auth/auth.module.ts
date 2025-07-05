import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import {
      RefreshToken,
      RefreshTokenSchema
} from './schemas/refresh-token.schema';
import { FileService } from '../shared/file/file.service';

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
