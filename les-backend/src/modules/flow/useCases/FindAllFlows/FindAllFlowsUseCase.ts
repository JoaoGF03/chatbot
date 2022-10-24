import { Flow } from '@prisma/client';
import { inject, injectable } from 'tsyringe';

import { IFlowsRepository } from '@modules/flow/repositories/IFlowsRepository';

@injectable()
export class FindAllFlowsUseCase {
  constructor(
    @inject('FlowsRepository')
    private usersRepository: IFlowsRepository,
  ) {}

  public async execute(userId: string): Promise<Flow[]> {
    const flows = await this.usersRepository.findAll(userId);

    return flows;
  }
}
