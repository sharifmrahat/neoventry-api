import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { BaseService } from 'src/common/base-service';
import { QueryHelper } from 'src/common/query-helper';
import { ApiResponse } from 'src/interfaces/api-response';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserQueryArgs, UserSortArgs } from './dto/user.args';

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

  //TODO: Update Profile
  // async updateMyProfile(){

  // }
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
