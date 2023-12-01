import { Request, Response, NextFunction } from 'express';
import { ILogger } from '../logger/logger.interface';
import { IExeptionFilter } from './exeption.interface';
import { HTTPError } from './http-error';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import 'reflect-metadata';

@injectable()
export class ExeptionFilter implements IExeptionFilter {
  constructor(@inject(TYPES.ILogger) private logger: ILogger) {}
  catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction): void {
    if (err instanceof HTTPError) {
      this.logger.error(`[${err.context}] ${err.statusCode}: ${err.message}`);
      res.status(err.statusCode).json({ err: err.message });
    } else {
      this.logger.error(`Ошибка: ${err.message}`);
      res.status(500).json({ err: err.message });
    }
  }
}
