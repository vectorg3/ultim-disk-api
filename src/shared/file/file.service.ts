import { BadRequestException, Injectable } from '@nestjs/common';
import { ICreateDir } from './models';
import { ConfigService } from '@nestjs/config';
import * as fs from 'node:fs';

@Injectable()
export class FileService {
      constructor(private configService: ConfigService) {}

      createDir(file: ICreateDir) {
            try {
                  const filePath = `${this.configService.get('filePath')}\\${String(file.user)}\\${file.path}`;
                  if (!fs.existsSync(filePath)) {
                        fs.mkdirSync(filePath);
                  } else {
                        throw new BadRequestException(
                              'That directory already exists!'
                        );
                  }
            } catch (e) {
                  if (e.response.message)
                        throw new BadRequestException(e.response.message);
                  else
                        throw new BadRequestException(
                              'Error while creating directory'
                        );
            }
      }

      saveFile(file: Express.Multer.File, path: string, userId: string) {
            try {
                  const filePath = `${this.configService.get('filePath')}\\${userId}\\${path}`;
                  if (fs.existsSync(filePath))
                        throw new BadRequestException('File already exists!');
                  fs.writeFileSync(filePath, file.buffer, {});
            } catch (e) {
                  if (e.response.message)
                        throw new BadRequestException(e.response.message);
                  else throw new BadRequestException('Error while saving file');
            }
      }

      deleteFile(file: any) {
            const path = `${this.configService.get('filePath')}\\${file.user}\\${file.path}`;
            if (file.type === 'dir') fs.rmdirSync(path);
            else fs.unlinkSync(path);
      }
}
