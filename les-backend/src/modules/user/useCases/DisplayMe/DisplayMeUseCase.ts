import { User } from '@prisma/client';
import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';

import { IUsersRepository } from '@modules/user/repositories/IUsersRepository';

@injectable()
export class DisplayMeUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(id: string): Promise<User | undefined> {
    const user = await this.usersRepository.findById(id);

    if (!user) throw new AppError('User not found', 404);

    return user;
  }
}
