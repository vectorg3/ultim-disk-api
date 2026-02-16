import {
      Body,
      Controller,
      Delete,
      Get,
      Post,
      Query,
      Req,
      UploadedFile,
      UseGuards,
      UseInterceptors,
      UsePipes,
      ValidationPipe
} from '@nestjs/common';
import { AuthGuard } from '@shared/guards';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { DiskService } from '@disk/disk.service';
import { CreateDirDto } from '@disk/dtos';
import { RequestWithUserId } from '@shared/models';

@ApiTags('DiskController')
@UseGuards(AuthGuard)
@Controller('disk')
export class DiskController {
      constructor(private readonly diskService: DiskService) {}

      @Post()
      @ApiOperation({ summary: 'Directory creating' })
      @UsePipes(new ValidationPipe({ transform: true }))
      @ApiBody({ type: CreateDirDto })
      createDir(
            @Req() req: RequestWithUserId,
            @Body() createDirDto: CreateDirDto
      ) {
            return this.diskService.createDir(createDirDto, req.userId);
      }

      @Get()
      @ApiOperation({ summary: 'Getting directory' })
      getDir(@Query('parent') id: string, @Req() req: RequestWithUserId) {
            return this.diskService.getDirFiles(id, req.userId);
      }

      @Post('upload')
      @ApiOperation({ summary: 'File uploading' })
      @UseInterceptors(FileInterceptor('file'))
      uploadFile(
            @UploadedFile() file: Express.Multer.File,
            @Req() req: RequestWithUserId,
            @Query('parent') parentId?: string
      ) {
            return this.diskService.uploadFile(file, req.userId, parentId);
      }

      @Delete('delete')
      @ApiOperation({ summary: 'Delete directory' })
      deleteFile(@Query('fileId') id: string, @Req() req: RequestWithUserId) {
            return this.diskService.deleteFile(id, req.userId);
      }
}
