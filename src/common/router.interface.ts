import { Router, Request, Response, NextFunction } from 'express';
import { IMiddleware } from './middleware.interface';

export interface IControllerRoute {
  method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'put' | 'patch'>;
  path: string;
  func: (req: Request, res: Response, next: NextFunction) => void;
  middlewares?: IMiddleware[];
}

export type ExpressReturnType = Response<any, Record<string, any>>;
