import { sign } from 'jsonwebtoken';
import { resolve } from 'path';
import { inject, injectable } from 'tsyringe';

import { IMailProvider } from '@shared/container/providers/MailProvider/IMailProvider';

import { AppError } from '@errors/AppError';
import { JWT_SECRET } from '@utils/constants';

import { IUsersRepository } from '@modules/user/repositories/IUsersRepository';

interface IRequest {
  email: string;
}

@injectable()
export class SendForgotPasswordMailUseCase {
  constructor(
    @inject('UsersRepository')
    private accountsRepository: IUsersRepository,
    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  async execute({ email }: IRequest): Promise<string> {
    const user = await this.accountsRepository.findByEmail(email);

    if (!user) throw new AppError('Account not found', 404);

    const templatePath = resolve(
      __dirname,
      '..',
      '..',
      'views',
      'forgotPassword.hbs',
    );

    const token = sign({}, JWT_SECRET, {
      subject: user.id,
      expiresIn: '3h',
    });

    const variables = {
      name: user.name,
      link: `${process.env.RESET_PASSWORD_URL}${token}`,
    };

    await this.mailProvider.sendMail(
      email,
      '[Flow] - Recuperação de Senha',
      variables,
      templatePath,
    );

    return token;
  }
}
