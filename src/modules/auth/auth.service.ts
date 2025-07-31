import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginInput, SignupInput, UpdateRoleInput } from './dto/auth.input';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BaseService } from 'src/common/base-service';
import { ApiResponse } from 'src/interfaces/api-response';
import { User } from '@prisma/client';

@Injectable()
export class AuthService extends BaseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  async signup(
    input: SignupInput,
  ): Promise<ApiResponse<Omit<User, 'password'>>> {
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
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });

    delete newUser.password;

    return this.response({
      accessToken: token,
      result: newUser,
      message: 'User Successfully Created',
    });
  }

  async login(input: LoginInput): Promise<ApiResponse<Omit<User, 'password'>>> {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
    });
    if (!user) throw new UnauthorizedException('User not found!');

    const isMatch = await bcrypt.compare(input.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Password does not matched!');

    delete user.password;

    const token = this.jwtService.sign({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return this.response({
      accessToken: token,
      result: user,
      message: 'Successfully LoggedIn',
    });
  }

  async updateRole(
    input: UpdateRoleInput,
  ): Promise<ApiResponse<Omit<User, 'password'>>> {
    const user = await this.prisma.user.findUnique({
      where: { id: input.userId },
    });
    if (!user) throw new NotFoundException('User not found!');

    if (user.role === input.role) {
      throw new ConflictException('User already exist with same role');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: input.userId },
      data: {
        role: input.role,
      },
    });

    delete updatedUser.password;

    return this.response({
      result: updatedUser,
      message: 'Role successfully updated',
    });
  }
}
