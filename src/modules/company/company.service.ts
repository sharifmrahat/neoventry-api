import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseService } from 'src/common/base-service';
import { QueryHelper } from 'src/common/query-helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetCompanyArgs, GetCompanySortArgs } from './dto/company.args';
import {
  CompanyCreateInput,
  CompanyUpdateInput,
  CompanyUpdateStatusInput,
} from './dto/company.input';
import { UserPayload } from 'src/interfaces/user-context';
import { Role } from 'src/interfaces/enums/role';

@Injectable()
export class CompanyService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(input: CompanyCreateInput, logo: string, context: UserPayload) {
    //logo upload
    const exist = await this.prisma.company.findUnique({
      where: { email: input.email, phone: input.phone },
    });

    if (exist) {
      throw new ConflictException(
        'Company already exists using same email or phone',
      );
    }

    const data = {
      ...input,
      ownerId: context.id,
      logo,
    };
    const newCompany = await this.prisma.company.create({ data });
    return this.response({
      result: newCompany,
      message: 'Company created successfully',
    });
  }

  async findAll(query: GetCompanyArgs, sort: GetCompanySortArgs) {
    const { skip, limit, page } = QueryHelper.getPagination(query);
    const orderBy = QueryHelper.getSort(sort.sortBy, sort.sortOrder);

    const userSearchFields: (keyof Prisma.CompanyWhereInput)[] = [
      'name',
      'email',
      'phone',
      'address',
    ];

    const where: Prisma.CompanyWhereInput = {
      AND: [
        QueryHelper.getSearchFilter(query.search, userSearchFields),
        QueryHelper.getActiveFilter(query.isActive),
      ].filter(Boolean),
    };

    const [data, total] = await Promise.all([
      this.prisma.company.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.company.count({ where }),
    ]);

    return this.response({
      result: data,
      message: 'Companies retrieved successfully',
      meta: {
        page,
        limit,
        total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  }

  async findOneById(id: string, context: UserPayload) {
    if (context.role === Role.USER) {
      const company = await this.prisma.company.findUnique({
        where: { id, ownerId: context.id, isDeleted: false },
      });

      if (!company) {
        throw new NotFoundException('Company Not Found!');
      }

      return this.response({
        result: company,
        message: 'Company info retrieved successfully',
      });
    }

    const exist = await this.prisma.company.findUnique({
      where: { id, isDeleted: false },
    });

    if (!exist) {
      throw new NotFoundException('Company Not Found!');
    }

    return this.response({
      result: exist,
      message: 'Company info retrieved successfully',
    });
  }

  async updateOneById(input: CompanyUpdateInput, context: UserPayload) {
    const { id, ...data } = input;
    if (context.role === Role.USER) {
      const company = await this.prisma.company.findUnique({
        where: { id, ownerId: context.id, isDeleted: false },
      });

      if (!company) {
        throw new NotFoundException('Company Not Found!');
      }

      const updatedCompany = await this.prisma.company.update({
        where: { id, ownerId: context.id, isDeleted: false },
        data,
      });

      return this.response({
        result: updatedCompany,
        message: 'Company info updated successfully',
      });
    }

    const exist = await this.prisma.company.findUnique({
      where: { id, isDeleted: false },
    });

    if (!exist) {
      throw new NotFoundException('Company Not Found!');
    }

    const updatedCompany = await this.prisma.company.update({
      where: { id, isDeleted: false },
      data,
    });

    return this.response({
      result: updatedCompany,
      message: 'Company info updated successfully',
    });
  }

  async deleteOneById(id: string, context: UserPayload) {
    const data = {
      isDeleted: true,
      isActive: false,
    };
    if (context.role === Role.USER) {
      const company = await this.prisma.company.findUnique({
        where: { id, ownerId: context.id, isDeleted: false },
      });

      if (!company) {
        throw new NotFoundException('Company Not Found!');
      }

      const deleteCompany = await this.prisma.company.update({
        where: { id, ownerId: context.id, isDeleted: false },
        data,
      });

      return this.response({
        result: deleteCompany,
        message: 'Company deleted successfully',
      });
    }

    const exist = await this.prisma.company.findUnique({
      where: { id, isDeleted: false },
    });

    if (!exist) {
      throw new NotFoundException('Company Not Found!');
    }

    const deletedCompany = await this.prisma.company.update({
      where: { id, isDeleted: false },
      data,
    });

    return this.response({
      result: deletedCompany,
      message: 'Company deleted successfully',
    });
  }

  async updateStatus(input: CompanyUpdateStatusInput, context: UserPayload) {
    const { id, status } = input;
    const exist = await this.prisma.company.findUnique({
      where: { id, isDeleted: false },
    });

    if (!exist) {
      throw new NotFoundException('Company Not Found!');
    }

    const updatedCompany = await this.prisma.company.update({
      where: { id, isDeleted: false },
      data: {
        applicationStatus: status,
      },
    });

    await this.prisma.timelineLog.create({
      data: {
        previousAction: exist.applicationStatus,
        currentAction: updatedCompany.applicationStatus,
        userId: context.id,
      },
    });

    return this.response({
      result: updatedCompany,
      message: 'Company status updated successfully',
    });
  }
}
