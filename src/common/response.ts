import { HttpStatus } from '@nestjs/common';
import { ApiResponse } from 'src/interfaces/api-response';

const responseData = <T>(data: {
  result?: T;
  message?: string;
  status?: boolean;
  statusCode?: number;
  accessToken?: string;
  meta?: Record<string, unknown>;
}): ApiResponse<T> => {
  const status = data.status ?? true;
  const statusCode = data.statusCode ?? HttpStatus.OK;

  return {
    success: status,
    statusCode,
    data: data.result,
    ...(data.message ? { message: data.message } : {}),
    ...(data.accessToken ? { accessToken: data.accessToken } : {}),
    ...(data.meta ? { meta: data.meta } : {}),
  };
};

export default responseData;
