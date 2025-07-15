import {
      Body,
      Controller,
      Get,
      Post,
      Query,
      Req,
      UseGuards,
      UsePipes,
      ValidationPipe
} from '@nestjs/common';
import { DiskService } from './disk.service';
import { RequestWithUserId } from '../shared';
import { CreateDirDto } from './dtos';
import { AuthGuard } from '../shared/guards';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

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
}
