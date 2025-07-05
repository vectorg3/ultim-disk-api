import { Injectable } from '@nestjs/common';
import { CreateDirDto } from './dtos/createDir.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FileModel } from './schemas/file.schema';
import { Model, Types } from 'mongoose';
import { FileService } from '../shared/file';

@Injectable()
export class DiskService {
      constructor(
            @InjectModel(FileModel.name) private fileModel: Model<FileModel>,
            private fileService: FileService
      ) {}

      async createDir(createDirDto: CreateDirDto, userId: string) {
            const file = new this.fileModel({
                  name: createDirDto.name,
                  type: createDirDto.type,
                  user: userId
            });
            if (createDirDto.parent)
                  file.parent =
                        createDirDto.parent as unknown as Types.ObjectId;
            const parent = createDirDto.parent
                  ? await this.fileModel.findById(createDirDto.parent)
                  : null;
            if (!parent) {
                  file.path = createDirDto.name;
                  this.fileService.createDir({
                        path: file.path,
                        user: userId
                  });
            } else {
                  file.path = `${parent.path}\\${file.name}`;
                  this.fileService.createDir({
                        path: file.path,
                        user: userId
                  });
                  parent.childs.push(file._id as Types.ObjectId);
                  await parent.save();
            }
            await file.save();
            return file;
      }

      async getDirFiles(dirId: string, userId: string) {
            return this.fileModel.find({
                  parent: dirId,
                  user: userId
            });
      }
}
