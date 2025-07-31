import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from 'src/interfaces/user-context';

export const UserContext = createParamDecorator<
  keyof UserPayload | undefined,
  ExecutionContext,
  UserPayload[keyof UserPayload] | UserPayload
>((data: keyof UserPayload | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user as UserPayload;
  return data ? user?.[data] : user;
});
