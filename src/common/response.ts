import { HttpStatus } from '@nestjs/common';

type IData<T> = {
  result?: T;
  message?: string;
  status?: boolean;
  statusCode?: number;
  accessToken?: string;
  meta?: Record<string, unknown>;
};

const responseData = <T>(data: IData<T>) => {
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
