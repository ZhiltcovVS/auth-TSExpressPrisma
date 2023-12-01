import { Router, Request, Response, NextFunction } from 'express';
import { IMiddleware } from './middleware.interface';

export interface IControllerRoute {
  method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'put' | 'patch'>;
  path: string;
  func: (req: Request, res: Response, next: NextFunction) => void;
  middlewares?: IMiddleware[];
}

export type ExpressReturnType = Response<any, Record<string, any>>;

/**
 * keyof - можно преобразовать ключи объекта в типы
 * Pick<Интерфейс, значения> - утилитарный тип, который берет из интерфейса значения и создает их них новый интерфейс
 * <Router, 'get' | 'post' | 'delete' | 'put' | 'patch'> -
 */
