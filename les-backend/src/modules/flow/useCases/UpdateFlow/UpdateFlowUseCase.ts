import { Flow } from '@prisma/client';
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
    buttons,
    message,
    name,
    userId,
  }: IUpdateFlowDTO): Promise<Flow> {
    let flow = await this.flowsRepository.findByName(name, userId);

    if (flow) throw new AppError('Flow already exists');

    flow = await this.flowsRepository.create({
      buttons,
      message,
      name,
      userId,
    });

    return flow;
  }
}
