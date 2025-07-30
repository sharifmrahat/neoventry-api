import { ApiResponse } from 'src/interfaces/api-response';
import responseData from './response';

export abstract class BaseService {
  protected response<T>(data: {
    result?: T;
    message?: string;
    status?: boolean;
    statusCode?: number;
    accessToken?: string;
    meta?: Record<string, unknown>;
  }): ApiResponse<T> {
    return responseData(data);
  }
}
