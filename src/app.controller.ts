import { Controller, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './shared/guards';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller()
export class AppController {
      constructor(private readonly appService: AppService) {}
}
