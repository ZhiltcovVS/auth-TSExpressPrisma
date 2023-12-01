import { Server } from 'http';
import express, { Express } from 'express';
import { IExeptionFilter } from './error/exeption.interface';
import { ILogger } from './logger/logger.interface';
import { injectable, inject } from 'inversify';
import { TYPES } from './types';
import 'reflect-metadata';
import { json } from 'body-parser';
import { IConfigService } from './config/config.service.interface';
import { UserController } from './users/users.controller';
import { PrismaService } from './database/prisma.service';
import { AuthMiddleware } from './common/auth.middleware';
import { IUserRepository } from './users/users.repository.interface';

@injectable()
export class App {
  port: number;
  server: Server;
  app: Express;

  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.UserController) private userController: UserController,
    @inject(TYPES.IExeptionFilter) private exeptionFilter: IExeptionFilter,
    @inject(TYPES.IConfigService) private configService: IConfigService,
    @inject(TYPES.PrismaService) private prismaService: PrismaService,
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
  ) {
    this.port = 8000;
    this.app = express();
  }

  useMiddleware(): void {
    this.app.use(json());
    const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'));
    this.app.use(authMiddleware.execute.bind(authMiddleware));
  }

  useRouter(): void {
    this.app.use('/users', this.userController.router);
  }

  useExeptionFilters(): void {
    this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
  }

  public async init(): Promise<void> {
    this.useMiddleware();
    this.useRouter();
    this.useExeptionFilters();
    this.prismaService.connect();
    this.server = this.app.listen(this.port);
    this.logger.log(`Сервер запущен на http://localhost:${this.port}`);
  }

  public close(): void {
    this.server.close();
  }
}
