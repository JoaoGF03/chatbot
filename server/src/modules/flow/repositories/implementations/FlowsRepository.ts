import { Flow } from '@prisma/client';

import { prisma } from '@shared/infra/prisma';

import {
  ICreateFlowDTO,
  IFindFlowByNameDTO,
  IUpdateFlowDTO,
} from '../FlowsDTO';
import { IFlowsRepository } from '../IFlowsRepository';

export class FlowsRepository implements IFlowsRepository {
  private ormRepository = prisma.flow;

  public async create({
    message,
    name,
    userId,
    buttons = [],
  }: ICreateFlowDTO): Promise<Flow> {
    const flow = await this.ormRepository.create({
      data: {
        message,
        name,
        userId,
        button: {
          create: {
            name,
            userId,
          },
        },
        buttons: {
          connect: buttons.map(button => ({
            id: button.id,
          })),
        },
      },
    });

    return flow;
  }

  public async findById(id: string): Promise<Flow> {
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
      include: {
        buttons: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return flows;
  }

  public async findByName(
    name: string,
    userId: string,
  ): Promise<IFindFlowByNameDTO> {
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
            id: true,
            name: true,
          },
        },
      },
    });

    return flow;
  }

  public async update({
    id,
    message,
    name,
    oldName,
    userId,
    buttons = [],
  }: IUpdateFlowDTO): Promise<void> {
    if (name) {
      await this.ormRepository.update({
        where: {
          id,
        },
        data: {
          name,
          message,
          buttons: {
            set: buttons.map(button => ({
              id: button.id,
            })),
          },
        },
      });

      await prisma.button.update({
        where: {
          name_createdBy: {
            name: oldName,
            userId,
          },
        },
        data: {
          name,
        },
      });
    }

    await this.ormRepository.update({
      where: {
        id,
      },
      data: {
        message,
        buttons: {
          set: buttons.map(button => ({
            id: button.id,
          })),
        },
      },
    });
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete({
      where: {
        id,
      },
    });
  }
}
