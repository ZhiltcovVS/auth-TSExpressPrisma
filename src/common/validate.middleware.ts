import { IMiddleware } from './middleware.interface';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export class ValidateMiddleware implements IMiddleware {
  constructor(private classToValidate: ClassConstructor<object>) {}

  execute({ body }: Request, res: Response, next: NextFunction): void {
    const instance = plainToClass(this.classToValidate, body);
    console.log('instance', instance);
    validate(instance).then((errors) => {
      if (errors.length > 0) {
        res.status(422).send(errors);
      } else {
        next();
      }
    });
  }
}
