import { Injectable } from '@nestjs/common';
import { LoginInput } from './dto/auth.input';

@Injectable()
export class AuthService {
  async login(input: LoginInput): Promise<string> {
    // Implement login logic here
    console.log({ input });
    return 'Login successful';
  }
}
