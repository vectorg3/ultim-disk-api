import { Module } from '@nestjs/common';
import { DiskService } from './disk.service';
import { DiskController } from './disk.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { FileModel, FileSchema } from './schemas/file.schema';
import { FileService } from '../shared/file/file.service';

@Module({
      imports: [
            ConfigModule,
            MongooseModule.forFeature([
                  { name: FileModel.name, schema: FileSchema }
            ])
      ],
      controllers: [DiskController],
      providers: [DiskService, FileService]
})
export class DiskModule {}
