import { UserPayload } from 'src/interfaces/user-context';
import { UserContext } from './../../common/decorators/user-context.decorator';
import { UserService } from './user.service';
import { Body, Controller, Get, Patch, Query } from '@nestjs/common';
import { UserQueryArgs, UserSortArgs } from './dto/user.args';
import { PublicAccess } from 'src/common/decorators/role.decorator';
import { UserUpdateInput } from './dto/user.input';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/profile')
  getMyProfile(@UserContext() context: UserPayload) {
    return this.userService.getMyProfile(context.id);
  }

  @PublicAccess()
  @Get('/')
  getAllUsers(@Query() query: UserQueryArgs, @Query() sort: UserSortArgs) {
    return this.userService.findAllUser(query, sort);
  }

  @Patch('/profile')
  updateProfile(
    @Body() input: UserUpdateInput,
    @UserContext() context: UserPayload,
  ) {
    return this.userService.updateMyProfile(input, context.id);
  }
}
