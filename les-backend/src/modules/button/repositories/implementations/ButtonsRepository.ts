import { Button } from '@prisma/client';

import { prisma } from '@shared/infra/prisma';

import { ICreateButtonDTO, IFindAllButtonsDTO } from '../ButtonsDTO';
import { IButtonsRepository } from '../IButtonsRepository';

export class ButtonsRepository implements IButtonsRepository {
  private ormRepository = prisma.button;

  public async create({ name, userId }: ICreateButtonDTO): Promise<Button> {
    const button = await this.ormRepository.create({
      data: {
        name,
        userId,
      },
    });

    return button;
  }

  public async findById(id: string): Promise<Button | null> {
    const button = await this.ormRepository.findUnique({
      where: {
        id,
      },
    });

    return button;
  }

  public async findAll(userId: string): Promise<IFindAllButtonsDTO[]> {
    const buttons = await this.ormRepository.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    return buttons;
  }

  public async findByName(name: string, userId: string): Promise<Button> {
    const button = await this.ormRepository.findUnique({
      where: {
        name_createdBy: {
          name,
          userId,
        },
      },
    });

    return button;
  }
}
