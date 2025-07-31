import { UserPayload } from 'src/interfaces/user-context';
import { UserContext } from './../../common/decorators/user-context.decorator';
import { UserService } from './user.service';
import { Controller, Get } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/profile')
  getMyProfile(@UserContext() context: UserPayload) {
    console.log(context);
    return this.userService.getMyProfile(context.id);
  }
}
