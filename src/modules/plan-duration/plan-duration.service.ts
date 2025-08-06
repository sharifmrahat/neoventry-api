import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseService } from 'src/common/base-service';
import { QueryHelper } from 'src/common/query-helper';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  GetPlanDurationArgs,
  GetPlanDurationSortArgs,
} from './dto/plan-duration.args';
import {
  PlanDurationCreateInput,
  PlanDurationUpdateInput,
} from './dto/plan-duration.input';

@Injectable()
export class PlanDurationService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(input: PlanDurationCreateInput) {
    const { planId, ...rest } = input;
    const exist = await this.prisma.planDuration.findFirst({
      where: {
        name: input.name,
        range: input.range,
      },
    });

    if (exist) {
      throw new ConflictException(
        'Plan Duration already exists using same name or range',
      );
    }

    const findPlan = await this.prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!findPlan) {
      throw new ConflictException('Plan is not found');
    }

    const newPlanDuration = await this.prisma.planDuration.create({
      data: {
        ...rest,
        planId: findPlan.id,
      },
    });

    return this.response({
      result: newPlanDuration,
      message: 'Plan Duration created successfully',
    });
  }

  async findAll(query: GetPlanDurationArgs, sort: GetPlanDurationSortArgs) {
    const { skip, limit, page } = QueryHelper.getPagination(query);
    const orderBy = QueryHelper.getSort(sort.sortBy, sort.sortOrder);

    const userSearchFields: (keyof Prisma.PlanDurationWhereInput)[] = [
      'name',
      'range',
      'type',
    ];

    const where: Prisma.PlanDurationWhereInput = {
      AND: [
        QueryHelper.getSearchFilter(query.search, userSearchFields),
        QueryHelper.getActiveFilter(query.isActive),
      ].filter(Boolean),
    };

    const [data, total] = await Promise.all([
      this.prisma.planDuration.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.planDuration.count({ where }),
    ]);

    return this.response({
      result: data,
      message: 'PlanDurations retrieved successfully',
      meta: {
        page,
        limit,
        total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  }

  async findOneById(id: string) {
    const exist = await this.prisma.planDuration.findUnique({
      where: { id, isDeleted: false },
    });

    if (!exist) {
      throw new NotFoundException('Plan Duration Not Found!');
    }

    return this.response({
      result: exist,
      message: 'Plan Duration info retrieved successfully',
    });
  }

  async updateOneById(input: PlanDurationUpdateInput) {
    const { id, ...data } = input;

    const exist = await this.prisma.planDuration.findUnique({
      where: { id, isDeleted: false },
    });

    if (!exist) {
      throw new NotFoundException('Plan Duration Not Found!');
    }

    const updatedPlanDuration = await this.prisma.planDuration.update({
      where: { id, isDeleted: false },
      data,
    });

    return this.response({
      result: updatedPlanDuration,
      message: 'Plan Duration info updated successfully',
    });
  }

  async deleteOneById(id: string) {
    const data = {
      isDeleted: true,
      isActive: false,
    };

    const exist = await this.prisma.planDuration.findUnique({
      where: { id, isDeleted: false },
    });

    if (!exist) {
      throw new NotFoundException('Plan Duration Not Found!');
    }

    const deletedPlanDuration = await this.prisma.planDuration.update({
      where: { id, isDeleted: false },
      data,
    });

    return this.response({
      result: deletedPlanDuration,
      message: 'Plan Duration deleted successfully',
    });
  }
}
