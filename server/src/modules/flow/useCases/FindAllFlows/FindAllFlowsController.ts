import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { FindAllFlowsUseCase } from './FindAllFlowsUseCase';

export class FindAllFlowsController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const findAllFlowsUseCase = container.resolve(FindAllFlowsUseCase);

    const flow = await findAllFlowsUseCase.execute(id);

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setTimeout(() => {}, 5000);

    return response.json(flow);
  }
}
