import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@shared/schemas';
import { UserController } from '@user/user.controller';
import { UserService } from '@user/user.service';

@Module({
      imports: [
            MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
      ],
      controllers: [UserController],
      providers: [UserService]
})
export class UserModule {}
