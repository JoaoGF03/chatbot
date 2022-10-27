import { inject, injectable } from 'tsyringe';

import { IFindAllButtonsDTO } from '@modules/button/repositories/ButtonsDTO';
import { IButtonsRepository } from '@modules/button/repositories/IButtonsRepository';

@injectable()
export class FindAllButtonsUseCase {
  constructor(
    @inject('ButtonsRepository')
    private buttonsRepository: IButtonsRepository,
  ) {}

  public async execute(userId: string): Promise<IFindAllButtonsDTO[]> {
    const flows = await this.buttonsRepository.findAll(userId);

    return flows;
  }
}
