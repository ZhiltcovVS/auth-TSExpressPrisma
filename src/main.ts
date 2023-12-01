import { App } from './app';
import { ExeptionFilter } from './error/exeption.filter';
import { LoggerService } from './logger/logger.service';
import { ILogger } from './logger/logger.interface';
import { UserController } from './users/users.controller';
import { Container, ContainerModule, interfaces } from 'inversify';
import { TYPES } from './types';
import { IExeptionFilter } from './error/exeption.interface';
import { IUserController } from './users/users.controller.interface';
import { IUserService } from './users/user.service.interface';
import { IConfigService } from './config/config.service.interface';
import { IUserRepository } from './users/users.repository.interface';
import { UserService } from './users/user.service';
import { ConfigService } from './config/config.service';
import { PrismaService } from './database/prisma.service';
import { UserRepository } from './users/users.repository';

export interface IBootstrapReturn {
  app: App;
  appContainer: Container;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
  bind<IExeptionFilter>(TYPES.IExeptionFilter).to(ExeptionFilter);
  bind<IUserController>(TYPES.UserController).to(UserController);
  bind<IUserService>(TYPES.IUserService).to(UserService);
  bind<IConfigService>(TYPES.IConfigService).to(ConfigService).inSingletonScope();
  bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
  bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository).inSingletonScope();
  bind<App>(TYPES.Application).to(App);
});

async function bootstrap(): Promise<IBootstrapReturn> {
  const appContainer = new Container();
  appContainer.load(appBindings);
  const app = appContainer.get<App>(TYPES.Application);
  await app.init();
  return { appContainer, app };
}

export const boot = bootstrap();
