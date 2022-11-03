import { User } from '@prisma/client';
import { inject, injectable } from 'tsyringe';

import { IHashProvider } from '@shared/container/providers/HashProvider/IHashProvider';

import { AppError } from '@errors/AppError';

import { IUsersRepository } from '@modules/user/repositories/IUsersRepository';
import { ICreateUserDTO } from '@modules/user/repositories/UsersDTO';

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    email,
    name,
    password,
  }: ICreateUserDTO): Promise<User> {
    const userAlreadyExists = await this.usersRepository.findByEmail(email);

    if (userAlreadyExists) throw new AppError('User already exists');

    const passwordHash = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      email,
      name,
      password: passwordHash,
    });

    delete user.password;

    return user;
  }
}
