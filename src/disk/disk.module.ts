import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { FileModel, FileSchema } from '@disk/schemas';
import { User, UserSchema } from '@shared/schemas';
import { DiskController } from '@disk/disk.controller';
import { DiskService } from '@disk/disk.service';
import { FileService } from '@shared/file';

@Module({
      imports: [
            ConfigModule,
            MongooseModule.forFeature([
                  { name: FileModel.name, schema: FileSchema },
                  { name: User.name, schema: UserSchema }
            ])
      ],
      controllers: [DiskController],
      providers: [DiskService, FileService]
})
export class DiskModule {}
