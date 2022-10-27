import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import { IHashProvider } from '@shared/providers/HashProvider/IHashProvider';

import { AppError } from '@errors/AppError';
import { JWT_SECRET } from '@utils/constants';

import { IUsersRepository } from '@modules/user/repositories/IUsersRepository';
import { IAuthenticateUserDTO } from '@modules/user/repositories/UsersDTO';

interface IResponse {
  user: { id: string; name: string; email: string; admin: boolean };
  token: string;
}

@injectable()
export class AuthenticateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}
  public async execute({
    email,
    password,
  }: IAuthenticateUserDTO): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Invalid login credentials', 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new AppError('Invalid login credentials', 401);
    }

    const token = sign({}, JWT_SECRET, {
      subject: user.id,
      expiresIn: '1d',
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        admin: user.admin,
      },
      token,
    };
  }
}
