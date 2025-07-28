import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/auth.input';

@Controller('auth')
export class AuthController {
  // Define your authentication endpoints here
  // For example, login, register, etc.
  // Example: @Post('login') async login(@Body() loginDto: LoginDto) { ... }

  // You can inject AuthService here to handle authentication logic
  constructor(private readonly authService: AuthService) {
    this.authService = authService;
  }

  @Post('login')
  async login(@Body() input: LoginInput): Promise<string> {
    return this.authService.login(input);
  }
}
