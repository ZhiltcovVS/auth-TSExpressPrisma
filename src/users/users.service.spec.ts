import 'reflect-metadata';
import { Container } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { IUserService } from './user.service.interface';
import { IUserRepository } from './users.repository.interface';
import { TYPES } from '../types';
import { UserService } from './user.service';
import { ConfigService } from '../config/config.service';
import { User } from './user.entity';
import { UserModel } from '@prisma/client';

/* Нужно замокать некоторые элементы нашего конфиг сервиса, чтобы не поднимать весь сервис */
const configServiceMock: IConfigService = {
  get: jest.fn(),
};

const userRepositoryMock: IUserRepository = {
  create: jest.fn(),
  find: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let userRepository: IUserRepository;
let userService: IUserService;

beforeAll(() => {
  container.bind<IUserService>(TYPES.IUserService).to(UserService);
  container.bind<IConfigService>(TYPES.IConfigService).toConstantValue(configServiceMock);
  container.bind<IUserRepository>(TYPES.IUserRepository).toConstantValue(userRepositoryMock);

  configService = container.get<IConfigService>(TYPES.IConfigService);
  userRepository = container.get<IUserRepository>(TYPES.IUserRepository);
  userService = container.get<IUserService>(TYPES.IUserService);
}); // выполняет перед каждым тестом. Частично собирает сервис, не запуская всё приложение

let createdUser: UserModel | null;

describe('User Service', () => {
  it('createUser', async () => {
    configService.get = jest.fn().mockReturnValueOnce(1);
    userRepository.create = jest.fn().mockImplementationOnce(
      (user: User): UserModel => ({
        email: user.email,
        name: user.name,
        password: user.password,
        id: 1,
      }),
    );
    createdUser = await userService.createUser({
      email: 'test@test.ru',
      name: 'test',
      password: '1',
    });
    expect(createdUser?.id).toEqual(1);
    expect(createdUser?.password).not.toEqual(1);
  }); // указываем, что тестируем

  it('validateUser - success', async () => {
    userRepository.find = jest.fn().mockReturnValueOnce(createdUser);
    const res = await userService.validateUser({
      email: 'test@test.ru',
      password: '1',
    });
    expect(res).toBeTruthy();
  });

  it('validateUser - wrong password', async () => {
    userRepository.find = jest.fn().mockReturnValueOnce(createdUser);
    const res = await userService.validateUser({
      email: 'test@test.ru',
      password: '2',
    });
    expect(res).toBeFalsy();
  });

  it('validateUser - wrong user', async () => {
    userRepository.find = jest.fn().mockReturnValueOnce(null);
    const res = await userService.validateUser({
      email: 'test2@test.ru',
      password: '2',
    });
    expect(res).toBeFalsy();
  });
}); // описывает, что мы тестируем
