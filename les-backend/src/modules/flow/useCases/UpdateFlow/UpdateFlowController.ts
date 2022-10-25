import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateFlowUseCase } from './UpdateFlowUseCase';

export class UpdateFlowController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { id: userId } = request.user;
    const { name, message, buttons } = request.body;
    const { id } = request.params;

    const createFlowUseCase = container.resolve(UpdateFlowUseCase);

    await createFlowUseCase.execute({
      name,
      message,
      buttons,
      userId,
      id,
    });

    return response.status(204).send();
  }
}
