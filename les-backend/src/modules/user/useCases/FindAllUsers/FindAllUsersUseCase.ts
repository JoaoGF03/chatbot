import { User } from '@prisma/client';
import { inject, injectable } from 'tsyringe';

import { IUsersRepository } from '@modules/user/repositories/IUsersRepository';

@injectable()
export class FindAllUsersUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}
  public async execute(): Promise<User[]> {
    const users = await this.usersRepository.findAll();

    return users;
  }
}
