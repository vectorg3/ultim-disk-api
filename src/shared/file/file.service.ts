import { BadRequestException, Injectable, Logger } from '@nestjs/common';
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
                              'Папка по данному пути уже существует'
                        );
                  }
            } catch (e) {
                  Logger.error(e);
                  throw new BadRequestException('Не удалось создать папку');
            }
      }
}
