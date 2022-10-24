import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateButtonUseCase } from './CreateButtonUseCase';

export class CreateButtonController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { name } = request.body;
    const { id } = request.user;

    const createButtonUseCase = container.resolve(CreateButtonUseCase);

    const button = await createButtonUseCase.execute({
      name,
      userId: id,
    });

    return response.status(201).json(button);
  }
}
