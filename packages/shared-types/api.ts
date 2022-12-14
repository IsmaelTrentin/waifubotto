import { ObjectLiteral } from './util';

export interface Timestampable {
  at: number;
}

export interface ApiResponse<
  T extends Record<string, any> = Record<string, any>
> extends Timestampable {
  code: number;
  data: T;
}

export interface ApiResponseError extends Timestampable {
  code: number;
  message: string;
  error?: ObjectLiteral;
}

export interface PagedResponse<
  T extends Record<string, any> = Record<string, any>
> extends ApiResponse {
  data: T[];
  previousPage: number;
  nextPage?: number;
}
