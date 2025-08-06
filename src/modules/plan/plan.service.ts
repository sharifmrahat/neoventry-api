import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseService } from 'src/common/base-service';
import { QueryHelper } from 'src/common/query-helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetPlanArgs, GetPlanSortArgs } from './dto/plan.args';
import { PlanCreateInput, PlanUpdateInput } from './dto/plan.input';

@Injectable()
export class PlanService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(input: PlanCreateInput) {
    const { planDurationId, ...rest } = input;
    const exist = await this.prisma.plan.findUnique({
      where: { title: input.title, planDurationId: planDurationId },
    });

    if (exist) {
      throw new ConflictException(
        'Plan already exists using same title or duration',
      );
    }

    const findDuration = await this.prisma.planDuration.findUnique({
      where: { id: planDurationId },
    });

    if (!findDuration) {
      throw new ConflictException('Plan duration is not found');
    }

    const newPlan = await this.prisma.plan.create({
      data: {
        ...rest,
        planDurationId: findDuration.id,
      },
    });

    return this.response({
      result: newPlan,
      message: 'Plan created successfully',
    });
  }

  async findAll(query: GetPlanArgs, sort: GetPlanSortArgs) {
    const { skip, limit, page } = QueryHelper.getPagination(query);
    const orderBy = QueryHelper.getSort(sort.sortBy, sort.sortOrder);

    const userSearchFields: (keyof Prisma.PlanWhereInput)[] = [
      'title',
      'subtitle',
      'description',
    ];

    const where: Prisma.PlanWhereInput = {
      AND: [
        QueryHelper.getSearchFilter(query.search, userSearchFields),
        QueryHelper.getActiveFilter(query.isActive),
      ].filter(Boolean),
    };

    const [data, total] = await Promise.all([
      this.prisma.plan.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.plan.count({ where }),
    ]);

    return this.response({
      result: data,
      message: 'Plans retrieved successfully',
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
    const exist = await this.prisma.plan.findUnique({
      where: { id, isDeleted: false },
    });

    if (!exist) {
      throw new NotFoundException('Plan Not Found!');
    }

    return this.response({
      result: exist,
      message: 'Plan info retrieved successfully',
    });
  }

  async updateOneById(input: PlanUpdateInput) {
    const { id, ...data } = input;

    const exist = await this.prisma.plan.findUnique({
      where: { id, isDeleted: false },
    });

    if (!exist) {
      throw new NotFoundException('Plan Not Found!');
    }

    const updatedPlan = await this.prisma.plan.update({
      where: { id, isDeleted: false },
      data,
    });

    return this.response({
      result: updatedPlan,
      message: 'Plan info updated successfully',
    });
  }

  async deleteOneById(id: string) {
    const data = {
      isDeleted: true,
      isActive: false,
    };

    const exist = await this.prisma.plan.findUnique({
      where: { id, isDeleted: false },
    });

    if (!exist) {
      throw new NotFoundException('Plan Not Found!');
    }

    const deletedPlan = await this.prisma.plan.update({
      where: { id, isDeleted: false },
      data,
    });

    return this.response({
      result: deletedPlan,
      message: 'Plan deleted successfully',
    });
  }
}
