import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';

import { IFlowsRepository } from '@modules/flow/repositories/IFlowsRepository';

@injectable()
export class DeleteFlowUseCase {
  constructor(
    @inject('FlowsRepository')
    private flowsRepository: IFlowsRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const flow = await this.flowsRepository.findById(id);

    if (!flow) throw new AppError('Flow not found', 404);

    if (flow.name === 'Welcome')
      throw new AppError('Welcome flow cannot be deleted');

    await this.flowsRepository.delete(id);
  }
}
