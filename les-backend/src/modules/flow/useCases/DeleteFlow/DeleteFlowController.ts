import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { DeleteFlowUseCase } from './DeleteFlowUseCase';

export class DeleteFlowController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteFlowUseCase = container.resolve(DeleteFlowUseCase);

    await deleteFlowUseCase.execute(id);

    return response.status(204).send();
  }
}
