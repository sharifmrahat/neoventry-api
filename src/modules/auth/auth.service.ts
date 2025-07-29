import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginInput, SignupInput } from './dto/auth.input';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import responseData from 'src/common/response';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(input: SignupInput): Promise<any> {
    const existing = await this.prisma.user.findFirst({
      where: { email: input.email, username: input.username },
    });
    if (existing)
      throw new ConflictException(
        'User already exists with same email & username',
      );

    const saltRound = this.configService.get<number>('JWT_SALT_ROUND');

    const hashedPassword = await bcrypt.hash(input.password, +saltRound);

    const newUser = await this.prisma.user.create({
      data: { ...input, password: hashedPassword },
    });

    const token = this.jwtService.sign({
      userId: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });

    delete newUser.password;

    return responseData({
      message: 'User Successfully Created',
      accessToken: token,
      result: newUser,
    });
  }

  async login(input: LoginInput): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(input.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    return {
      token: this.jwtService.sign({ sub: user.id, email: user.email }),
    };
  }
}
