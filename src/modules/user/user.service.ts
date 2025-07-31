import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { BaseService } from 'src/common/base-service';
import { ApiResponse } from 'src/interfaces/api-response';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async getMyProfile(
    userId: string,
  ): Promise<ApiResponse<Omit<User, 'password'>>> {
    const profile = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!profile) {
      throw new NotFoundException(`Profile not found with userId: ${userId}`);
    }

    delete profile.password;

    return this.response({
      result: profile,
    });
  }
}
