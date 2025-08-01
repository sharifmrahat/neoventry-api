import { SortOrder } from './enums/sort-order';

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export interface PaginationSort {
  sortBy?: 'createdAt' | 'updatedAt';
  sortOrder?: SortOrder;
}
