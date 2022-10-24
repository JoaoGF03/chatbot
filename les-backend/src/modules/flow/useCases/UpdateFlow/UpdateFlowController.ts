import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateFlowUseCase } from './UpdateFlowUseCase';

export class UpdateFlowController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { name, message, buttons } = request.body;
    const { id } = request.user;

    const createFlowUseCase = container.resolve(UpdateFlowUseCase);

    const flow = await createFlowUseCase.execute({
      name,
      message,
      buttons,
      userId: id,
    });

    return response.status(201).json(flow);
  }
}
