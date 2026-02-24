import {
      BadRequestException,
      Injectable,
      StreamableFile
} from '@nestjs/common';
import { encodeFileName, ICreateDir } from './models';
import { ConfigService } from '@nestjs/config';
import * as fs from 'node:fs';
import { createReadStream } from 'node:fs';

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
            if (file.type === 'dir') fs.rmSync(path, { recursive: true });
            else fs.unlinkSync(path);
      }

      downloadFile(file: any, userId: string) {
            const path = `${this.configService.get('filePath')}\\${userId}\\${file.path}`;
            if (!fs.existsSync(path))
                  throw new BadRequestException('File was not found!');
            const responseFile = createReadStream(path);
            const encodedFileName = encodeFileName(file.name);
            return new StreamableFile(responseFile, {
                  disposition: `attachment; filename*=UTF-8''${encodeURIComponent(file.name)}; filename="${encodedFileName}"`
            });
      }
}
