import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { FindAllUsersUseCase } from './FindAllUsersUseCase';

export class FindAllUsersController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const findAllUsersUseCase = container.resolve(FindAllUsersUseCase);

    const users = await findAllUsersUseCase.execute();

    return response.json(users);
  }
}
