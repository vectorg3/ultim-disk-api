import {
      BadRequestException,
      Injectable,
      UnauthorizedException
} from '@nestjs/common';
import { LoginDto, SignupDto } from './dtos';
import { InjectModel } from '@nestjs/mongoose';
import { FileService, User } from '../shared';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './schemas';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
      constructor(
            @InjectModel(User.name) private userModel: Model<User>,
            @InjectModel(RefreshToken.name)
            private refreshTokenModel: Model<RefreshToken>,
            private jwtService: JwtService,
            private fileService: FileService
      ) {}

      async signUp(body: SignupDto) {
            const { name, email, password } = body;
            const emailInUse = await this.userModel.findOne({
                  email: email
            });
            if (emailInUse)
                  throw new BadRequestException(
                        'Account with this email already exists'
                  );
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await this.userModel.create({
                  name,
                  email,
                  password: hashedPassword
            });
            this.fileService.createDir({ user: String(user._id), path: '' });
            return this.generateUserTokens(String(user._id));
      }

      async login(body: LoginDto) {
            const { email, password } = body;
            const user = await this.userModel.findOne<User>({ email });
            if (!user)
                  throw new UnauthorizedException('Wrong email or password');
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch)
                  throw new UnauthorizedException('Wrong email or password');
            return this.generateUserTokens(String(user._id));
      }

      async refreshTokens(refreshToken: string) {
            const dbToken = await this.refreshTokenModel.findOne<RefreshToken>({
                  token: refreshToken,
                  expiryDate: { $gte: new Date() }
            });
            if (!dbToken) throw new UnauthorizedException('Invalid token');
            return this.generateUserTokens(String(dbToken.userId));
      }

      private async generateUserTokens(userId: string) {
            const accessToken = this.jwtService.sign(
                  { userId },
                  { expiresIn: '3h' }
            );
            const refreshToken = uuidv4();

            await this.storeRefreshToken(refreshToken, userId);

            return {
                  accessToken,
                  refreshToken
            };
      }

      private async storeRefreshToken(token: string, userId: string) {
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 1);
            await this.refreshTokenModel.updateOne(
                  { userId },
                  { $set: { expiryDate, token } },
                  {
                        upsert: true
                  }
            );
      }
}
