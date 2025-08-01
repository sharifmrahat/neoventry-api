import { UserPayload } from 'src/interfaces/user-context';
import { UserContext } from './../../common/decorators/user-context.decorator';
import { UserService } from './user.service';
import { Controller, Get, Query } from '@nestjs/common';
import { UserQueryArgs, UserSortArgs } from './dto/user.args';
import { PublicAccess } from 'src/common/decorators/role.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/profile')
  getMyProfile(@UserContext() context: UserPayload) {
    console.log(context);
    return this.userService.getMyProfile(context.id);
  }

  @PublicAccess()
  @Get('/')
  getAllUsers(@Query() query: UserQueryArgs, @Query() sort: UserSortArgs) {
    return this.userService.findAllUser(query, sort);
  }
}
