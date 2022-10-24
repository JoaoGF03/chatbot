import { Button } from '@prisma/client';
import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';

import { ICreateButtonDTO } from '@modules/button/repositories/ButtonsDTO';
import { IButtonsRepository } from '@modules/button/repositories/IButtonsRepository';

@injectable()
export class CreateButtonUseCase {
  constructor(
    @inject('ButtonsRepository')
    private buttonsRepository: IButtonsRepository,
  ) {}

  public async execute({ name, userId }: ICreateButtonDTO): Promise<Button> {
    const button = await this.buttonsRepository.findByName(name, userId);

    if (button) throw new AppError('Button already exists');

    const newButton = await this.buttonsRepository.create({
      name,
      userId,
    });

    return newButton;
  }
}
