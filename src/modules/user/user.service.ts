import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { BaseService } from 'src/common/base-service';
import { QueryHelper } from 'src/common/query-helper';
import { ApiResponse } from 'src/interfaces/api-response';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserQueryArgs, UserSortArgs } from './dto/user.args';
import { UserUpdateInput } from './dto/user.input';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService extends BaseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
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
      message: 'Profile retrieved successfully',
    });
  }

  async updateMyProfile(input: UserUpdateInput, userId: string) {
    const userExist = await this.prisma.user.findUnique({
      where: { id: userId, isActive: true },
    });
    if (!userExist) {
      throw new NotFoundException(`User not found with ID: ${userId}`);
    }

    let password = '';

    if (input.username && input.username !== userExist.username) {
      const usernameExist = await this.prisma.user.findFirst({
        where: {
          username: input.username,
          isActive: true,
          NOT: { id: userId },
        },
      });
      if (usernameExist) {
        throw new ConflictException('User already exist with same username');
      }
    }

    if (input.currentPassword && input.newPassword) {
      const matched = await bcrypt.compare(
        input.currentPassword,
        userExist.password,
      );

      if (!matched) {
        throw new BadRequestException('Current password is wrong');
      }

      const saltRound = this.configService.get<number>('JWT_SALT_ROUND');

      const hashedPassword = await bcrypt.hash(input.newPassword, +saltRound);

      password = hashedPassword;
    }

    const data = {
      name: input.name,
      username: input.username,
      phone: input.phone,
      imageUrl: input.imageUrl,
      address: input.address,
      password: password ? password : userExist.password,
    };

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data,
    });

    return this.response({
      message: 'Profile updated successfully!',
      result: updatedUser,
    });
  }
  async findAllUser(query: UserQueryArgs, sort: UserSortArgs) {
    const { skip, limit, page } = QueryHelper.getPagination(query);
    const orderBy = QueryHelper.getSort(sort.sortBy, sort.sortOrder);

    const userSearchFields: (keyof Prisma.UserWhereInput)[] = [
      'name',
      'username',
      'email',
      'phone',
    ];
    const where: Prisma.UserWhereInput = {
      AND: [
        QueryHelper.getSearchFilter(query.search, userSearchFields),
        QueryHelper.getActiveFilter(query.isActive),
        query.role ? { role: query.role } : undefined,
      ].filter(Boolean),
    };

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return this.response({
      result: data,
      message: 'Users retrieved successfully',
      meta: {
        page,
        limit,
        total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  }
}
