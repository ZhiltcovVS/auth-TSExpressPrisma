import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';

@injectable()
export class PrismaService {
  client: PrismaClient;

  constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
    this.client = new PrismaClient();
  }

  async connect(): Promise<void> {
    try {
      this.loggerService.log('[PrismaService] Успешно подключено к БД');
    } catch (e) {
      if (e instanceof Error) {
        this.loggerService.error('[PrismaService] Ошибка подключения к БД: ' + e.message);
      }
    }
    await this.client.$connect();
  }

  async disconnect(): Promise<void> {
    await this.client.$disconnect();
  }
}
