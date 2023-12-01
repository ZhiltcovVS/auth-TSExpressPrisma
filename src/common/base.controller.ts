import { Router, Response } from 'express';
import { IControllerRoute, ExpressReturnType } from './router.interface';
import { ILogger } from '../logger/logger.interface';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable() // базовй класс тоже нужно сделать injectable, если потомки используют инверсифай иначе работать не будет
export abstract class BaseController {
  // Абстрактный, чтобы нельзя было создать контроллер без того, что здесь описано
  private readonly _router: Router; // Через подчеркивание, потому что это конвенция, что от него будут сделаны геттеры и сеттеры

  constructor(private logger: ILogger) {
    // private пишется здесь потому что именно здесь и определяется его тип, нельзя написать его в другом месте
    this._router = Router();
  }

  get router(): Router {
    return this._router;
  }

  public send<T>(res: Response, code: number, message: T): ExpressReturnType {
    res.type('application/json');
    return res.status(code).json(message);
  }

  public ok<T>(res: Response, message: T): ExpressReturnType {
    return this.send<T>(res, 200, message);
  }

  public created(res: Response): ExpressReturnType {
    return res.sendStatus(201);
  }

  /* Весь смысл в этом методе. Вызвав этот метод, мы можем сделать биндинг функции к роутам */
  protected bindRoutes(routes: IControllerRoute[]): void {
    // тут мы предполагаем, что нам придет массив роутов и это описываем в интерфейсе
    for (const route of routes) {
      this.logger.log(`[${route.method}] ${route.path}`);
      const handler = route.func.bind(this);
      const middlewares = route.middlewares?.map((m) => m.execute.bind(m)); // Просто перебиндили чтобы не портерять контекст
      const pipeline = middlewares ? [...middlewares, handler] : handler; // это очередь обработки роута, состоящая из обработчиков
      this.router[route.method](route.path, pipeline);
    }
  }
}

// private logger: LoggerService - стандартный DI которая позволяет использовать функционал logger без создания экземпляра внутри класса.
// это делает код более модульным и удобны для тестирования.
// protected значит что свойство/метод нельзя вызывать из инстанса класса, но можно вызывать из наследника

// const handler = route.func.bind(this); - Контекст теряется всегда при попытке извлечение метода из объекта с целью
// его дальнейшего вызова в качестве функции.
