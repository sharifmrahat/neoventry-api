import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInput, SignupInput } from './dto/auth.input';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  // Define your authentication endpoints here
  // For example, login, register, etc.
  // Example: @Post('login') async login(@Body() loginDto: LoginDto) { ... }

  // You can inject AuthService here to handle authentication logic
  constructor(private readonly authService: AuthService) {
    this.authService = authService;
  }

  @Public()
  @Post('signup')
  signup(@Body() input: SignupInput) {
    return this.authService.signup(input);
  }

  @Public()
  @Post('login')
  login(@Body() input: LoginInput) {
    return this.authService.login(input);
  }
}
