import { SortOrder } from 'src/interfaces/enums/sort-order';

export class QueryHelper {
  static getSearchFilter(search: string | undefined, fields: string[]) {
    if (!search || !fields.length) return undefined;

    return {
      OR: fields.map((field) => ({
        [field]: { contains: search, mode: 'insensitive' },
      })),
    };
  }

  static getActiveFilter(isActive: boolean = true, isDeleted: boolean = false) {
    return { isActive, isDeleted };
  }

  static getPagination(query: { page?: number; limit?: number }) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 20;
    const skip = (page - 1) * limit;
    return { skip, limit, page };
  }

  static getSort(
    sortBy?: string,
    sortOrder?: SortOrder,
    defaultSort: Record<string, SortOrder.ASC | SortOrder.DESC> = {
      createdAt: SortOrder.DESC,
    },
  ): Record<string, SortOrder> {
    if (!sortBy || !sortOrder) return defaultSort;

    return {
      [sortBy]: sortOrder,
    };
  }
}
