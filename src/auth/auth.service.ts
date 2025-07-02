import {
      BadRequestException,
      Injectable,
      UnauthorizedException
} from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './schemas/refresh-token.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
      constructor(
            @InjectModel(User.name) private userModel: Model<User>,
            @InjectModel(RefreshToken.name)
            private refreshTokenModel: Model<RefreshToken>,
            private jwtService: JwtService
      ) {}

      async signUp(body: SignupDto) {
            const { name, email, password } = body;
            const emailInUse = await this.userModel.findOne({
                  email: email
            });
            if (emailInUse)
                  throw new BadRequestException('Такая почта уже используется');
            const hashedPassword = await bcrypt.hash(password, 10);

            await this.userModel.create({
                  name,
                  email,
                  password: hashedPassword
            });
      }

      async login(body: LoginDto) {
            const { email, password } = body;
            const user = await this.userModel.findOne<User>({ email });
            if (!user)
                  throw new UnauthorizedException(
                        'Неверно указаны почта или пароль'
                  );
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch)
                  throw new UnauthorizedException(
                        'Неверно указаны почта или пароль'
                  );
            return this.generateUserTokens(String(user._id));
      }

      async refreshTokens(refreshToken: string) {
            const dbToken = await this.refreshTokenModel.findOne<RefreshToken>({
                  token: refreshToken,
                  expiryDate: { $gte: new Date() }
            });
            if (!dbToken) throw new UnauthorizedException('Неправильный токен');
            return this.generateUserTokens(String(dbToken.userId));
      }

      async generateUserTokens(userId: string) {
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

      async storeRefreshToken(token: string, userId: string) {
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
