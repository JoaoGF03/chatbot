import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateUserAvatarUseCase } from './UpdateUserAvatarUseCase';

export class UpdateUserAvatarController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const avatarFileName = request.file.filename;

    const updateUserAvatarUseCase = container.resolve(UpdateUserAvatarUseCase);

    await updateUserAvatarUseCase.execute({
      id,
      avatarFileName,
    });

    return response.status(204).send();
  }
}
