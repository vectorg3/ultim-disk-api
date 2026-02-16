import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FileService } from '@shared/file';
import { User } from '@shared/schemas';
import { FileModel } from '@disk/schemas';
import { CreateDirDto } from '@disk/dtos';
import { TariffPlanSpace } from '@shared/models';

@Injectable()
export class DiskService {
      constructor(
            @InjectModel(FileModel.name) private fileModel: Model<FileModel>,
            @InjectModel(User.name) private userModel: Model<User>,
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

      async uploadFile(
            file: Express.Multer.File,
            userId: string,
            parentId?: string
      ) {
            const parent = await this.fileModel.findOne({
                  user: userId,
                  _id: parentId
            });
            const user = await this.userModel.findById(userId);
            if (!user) throw new BadRequestException('User not found');
            if (file.size > TariffPlanSpace.get(user.plan)!)
                  throw new BadRequestException(
                        'Your free space is not enough to save this file'
                  );
            user.diskSpace += file.size;
            let path = '';
            if (parent) path = `${parent.path}\\${file.originalname}`;
            else path = file.originalname;
            this.fileService.saveFile(file, path, userId);
            const type = file.originalname.split('.').pop();
            const dbFile = await this.fileModel.create({
                  path,
                  type,
                  user: userId,
                  size: file.size,
                  parent: parentId,
                  name: file.originalname
            });
            if (parent) {
                  parent.childs.push(dbFile._id);
                  parent.size += file.size;
                  await parent.save();
            }
            await user.save();
      }

      async deleteFile(id: string, userId: string) {
            const file = await this.fileModel.findOne({
                  _id: id,
                  user: userId
            });
            if (!file) return new BadRequestException('File not found');
            this.fileService.deleteFile(file);
            await this.fileModel.findOneAndDelete({ user: userId, _id: id });
      }
}
