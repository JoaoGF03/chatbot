import { hash } from 'bcrypt';
import { JwtPayload, verify } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';
import { JWT_SECRET } from '@utils/constants';

import { IUsersRepository } from '@modules/user/repositories/IUsersRepository';

interface IRequest {
  token: string;
  password: string;
}

interface IJwtPayLoad extends JwtPayload {
  id: string;
}

@injectable()
export class ResetPasswordUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ token, password }: IRequest): Promise<void> {
    const { sub } = verify(token, JWT_SECRET) as IJwtPayLoad;

    const user = await this.usersRepository.findById(sub);

    if (!user) throw new AppError('Account not found', 404);

    user.password = await hash(password, 8);

    await this.usersRepository.updatePassword(user.id, user.password);
  }
}
