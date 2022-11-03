import { User } from '@prisma/client';

import { prisma } from '@shared/infra/prisma';

import { IUsersRepository } from '../IUsersRepository';
import { ICreateUserDTO, IUpdateAvatarDTO } from '../UsersDTO';

export class UsersRepository implements IUsersRepository {
  private ormRepository = prisma.user;

  public async create({
    email,
    name,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = await this.ormRepository.create({
      data: {
        email,
        name,
        password,
      },
    });

    await prisma.flow.create({
      data: {
        name: 'Welcome',
        message: 'Welcome to the Flow bot!',
        userId: user.id,
      },
    });

    return user;
  }

  public async findByEmail(email: string): Promise<User> {
    const user = await this.ormRepository.findUnique({
      where: {
        email,
      },
    });

    return user;
  }

  public async findByName(name: string): Promise<User | undefined> {
    const user = await this.ormRepository.findFirst({
      where: {
        name,
      },
    });

    return user;
  }

  public async findAll(): Promise<User[]> {
    const users = await this.ormRepository.findMany();

    return users;
  }

  public async findById(id: string): Promise<User | null> {
    const user = await this.ormRepository.findUnique({
      where: {
        id,
      },
    });

    return user;
  }

  public async pathAvatar({
    id,
    avatarFileName,
  }: IUpdateAvatarDTO): Promise<User> {
    const user = await this.ormRepository.update({
      where: {
        id,
      },
      data: {
        avatar: avatarFileName,
      },
    });

    return user;
  }

  public async updatePassword(id: string, password: string): Promise<void> {
    await this.ormRepository.update({
      where: {
        id,
      },
      data: {
        password,
      },
    });
  }
}
