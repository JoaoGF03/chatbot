import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { FindAllButtonsUseCase } from './FindAllButtonsUseCase';

export class FindAllButtonsController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const findAllButtonsUseCase = container.resolve(FindAllButtonsUseCase);

    const button = await findAllButtonsUseCase.execute(id);

    return response.status(201).json(button);
  }
}
