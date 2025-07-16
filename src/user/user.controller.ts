import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from '@user/user.service';
import { AuthGuard } from '@shared/guards';
import { RequestWithUserId } from '@shared/models';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
      constructor(private readonly userService: UserService) {}

      @Get('me')
      getUser(@Req() req: RequestWithUserId) {
            return this.userService.getUser(req.userId);
      }
}
