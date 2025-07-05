import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { DiskModule } from './disk/disk.module';
import config from './config/config';

@Module({
      imports: [
            ConfigModule.forRoot({
                  isGlobal: true,
                  cache: true,
                  load: [config]
            }),
            JwtModule.registerAsync({
                  imports: [ConfigModule],
                  useFactory: (config) => ({
                        secret: config.get('jwt.secret')
                  }),
                  global: true,
                  inject: [ConfigService]
            }),
            MongooseModule.forRootAsync({
                  imports: [ConfigModule],
                  useFactory: (config) => ({
                        uri: config.get('database.uri')
                  }),
                  inject: [ConfigService]
            }),
            AuthModule,
            DiskModule
      ],
      controllers: [AppController],
      providers: [AppService]
})
export class AppModule {}
