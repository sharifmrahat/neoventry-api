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
  GetPlanFeatureArgs,
  GetPlanFeatureSortArgs,
} from './dto/plan-feature.args';
import {
  PlanFeatureCreateInput,
  PlanFeatureUpdateInput,
} from './dto/plan-feature.input';

@Injectable()
export class PlanFeatureService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(input: PlanFeatureCreateInput) {
    const exist = await this.prisma.planFeature.findFirst({
      where: {
        title: input.title,
      },
    });

    if (exist) {
      throw new ConflictException(
        'Plan Feature already exists using same title',
      );
    }

    const newPlanFeature = await this.prisma.planFeature.create({
      data: input,
    });

    return this.response({
      result: newPlanFeature,
      message: 'Plan Feature created successfully',
    });
  }

  async findAll(query: GetPlanFeatureArgs, sort: GetPlanFeatureSortArgs) {
    const { skip, limit, page } = QueryHelper.getPagination(query);
    const orderBy = QueryHelper.getSort(sort.sortBy, sort.sortOrder);

    const userSearchFields: (keyof Prisma.PlanFeatureWhereInput)[] = [
      'title',
      'conditions',
    ];

    const where: Prisma.PlanFeatureWhereInput = {
      AND: [
        QueryHelper.getSearchFilter(query.search, userSearchFields),
        QueryHelper.getActiveFilter(query.isActive),
      ].filter(Boolean),
    };

    const [data, total] = await Promise.all([
      this.prisma.planFeature.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.planFeature.count({ where }),
    ]);

    return this.response({
      result: data,
      message: 'Plan Features retrieved successfully',
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
    const exist = await this.prisma.planFeature.findUnique({
      where: { id, isDeleted: false },
    });

    if (!exist) {
      throw new NotFoundException('Plan Feature Not Found!');
    }

    return this.response({
      result: exist,
      message: 'Plan Feature info retrieved successfully',
    });
  }

  async updateOneById(input: PlanFeatureUpdateInput) {
    const { id, ...data } = input;

    const exist = await this.prisma.planFeature.findUnique({
      where: { id, isDeleted: false },
    });

    if (!exist) {
      throw new NotFoundException('Plan Feature Not Found!');
    }

    const updatedPlanFeature = await this.prisma.planFeature.update({
      where: { id, isDeleted: false },
      data,
    });

    return this.response({
      result: updatedPlanFeature,
      message: 'Plan Feature info updated successfully',
    });
  }

  async deleteOneById(id: string) {
    const data = {
      isDeleted: true,
      isActive: false,
    };

    const exist = await this.prisma.planFeature.findUnique({
      where: { id, isDeleted: false },
    });

    if (!exist) {
      throw new NotFoundException('Plan Feature Not Found!');
    }

    const deletedPlanFeature = await this.prisma.planFeature.update({
      where: { id, isDeleted: false },
      data,
    });

    return this.response({
      result: deletedPlanFeature,
      message: 'Plan Feature deleted successfully',
    });
  }
}
