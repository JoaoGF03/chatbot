import { Flow } from '@prisma/client';

import { prisma } from '@shared/infra/prisma';

import { ICreateFlowDTO } from '../FlowsDTO';
import { IFlowsRepository } from '../IFlowsRepository';

export class FlowsRepository implements IFlowsRepository {
  private ormRepository = prisma.flow;

  public async create({
    message,
    name,
    userId,
    buttons,
  }: ICreateFlowDTO): Promise<Flow> {
    const buttonsData = buttons
      ? {
          connect: buttons.map(button => ({
            id: button.id,
          })),
        }
      : {};
    const flow = await this.ormRepository.create({
      data: {
        message,
        name,
        userId,
        buttons: buttonsData,
      },
    });

    await prisma.button.create({
      data: {
        name,
        userId,
      },
    });

    return flow;
  }

  public async findById(id: string): Promise<Flow | null> {
    const flow = await this.ormRepository.findUnique({
      where: {
        id,
      },
    });

    return flow;
  }

  public async findAll(userId: string): Promise<Flow[]> {
    const flows = await this.ormRepository.findMany({
      where: {
        userId,
      },
    });

    return flows;
  }

  public async findByName(name: string, userId: string): Promise<Flow> {
    const flow = await this.ormRepository.findUnique({
      where: {
        name_createdBy: {
          name,
          userId,
        },
      },
      include: {
        buttons: {
          select: {
            name: true,
          },
        },
      },
    });

    return flow;
  }
}
