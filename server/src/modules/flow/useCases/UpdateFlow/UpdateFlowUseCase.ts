import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';

import { IUpdateFlowDTO } from '@modules/flow/repositories/FlowsDTO';
import { IFlowsRepository } from '@modules/flow/repositories/IFlowsRepository';

@injectable()
export class UpdateFlowUseCase {
  constructor(
    @inject('FlowsRepository')
    private flowsRepository: IFlowsRepository,
  ) {}

  public async execute({
    id,
    userId,
    buttons,
    message,
    name,
  }: IUpdateFlowDTO): Promise<void> {
    const flow = await this.flowsRepository.findById(id);

    if (!flow) throw new AppError('Flow not found', 404);

    if (name) {
      const flowExists = await this.flowsRepository.findByName(name, userId);

      if (flowExists && flowExists.id !== id)
        throw new AppError('Flow already exists', 409);
    }

    await this.flowsRepository.update({
      id,
      message: message || flow.message,
      name: flow.name === 'Welcome' ? undefined : name || flow.name,
      oldName: flow.name,
      userId,
      buttons,
    });
  }
}
