import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '@shared/schemas';

@Injectable()
export class UserService {
      constructor(@InjectModel(User.name) private userModel: Model<User>) {}

      getUser(id: string) {
            return this.userModel.findById(id).select('-password -__v');
      }
}
