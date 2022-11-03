import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ResetPasswordUseCase } from './ResetPasswordUseCase';

export class ResetPasswordController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { token } = request.query;
    const { password } = request.body;

    const resetPassword = container.resolve(ResetPasswordUseCase);

    await resetPassword.execute({
      token: String(token),
      password,
    });

    return response.status(204).send();
  }
}
