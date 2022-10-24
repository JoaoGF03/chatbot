import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateFlowUseCase } from './CreateFlowUseCase';

export class CreateFlowController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { name, message, buttons } = request.body;
    const { id } = request.user;

    const createFlowUseCase = container.resolve(CreateFlowUseCase);

    const flow = await createFlowUseCase.execute({
      name,
      message,
      buttons,
      userId: id,
    });

    return response.status(201).json(flow);
  }
}
