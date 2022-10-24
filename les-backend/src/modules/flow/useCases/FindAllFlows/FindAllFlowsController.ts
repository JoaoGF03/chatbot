import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { FindAllFlowsUseCase } from './FindAllFlowsUseCase';

export class FindAllFlowsController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const findAllFlowsUseCase = container.resolve(FindAllFlowsUseCase);

    const flow = await findAllFlowsUseCase.execute(id);

    return response.status(201).json(flow);
  }
}
