import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './guards/auth.guard';
import { RequestWithUserId } from './models';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller()
export class AppController {
      constructor(private readonly appService: AppService) {}

      @Get('test')
      test(@Req() request: RequestWithUserId): string {
            return request.userId;
      }
}
