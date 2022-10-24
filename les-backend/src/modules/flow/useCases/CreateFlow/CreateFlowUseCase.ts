import { Flow } from '@prisma/client';
import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';

import { ICreateFlowDTO } from '@modules/flow/repositories/FlowsDTO';
import { IFlowsRepository } from '@modules/flow/repositories/IFlowsRepository';

@injectable()
export class CreateFlowUseCase {
  constructor(
    @inject('FlowsRepository')
    private flowsRepository: IFlowsRepository,
  ) {}

  public async execute({
    buttons,
    message,
    name,
    userId,
  }: ICreateFlowDTO): Promise<Flow> {
    if (!name || !message || !userId)
      throw new AppError(
        `Missing parameters:${name ? '' : ' name'}${message ? '' : ' message'}${
          userId ? '' : ' userId'
        }`,
      );

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
