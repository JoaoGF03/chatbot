import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { DisplayMeUseCase } from './DisplayMeUseCase';

export class DisplayMeController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const displayMe = container.resolve(DisplayMeUseCase);

    const user = await displayMe.execute(id);

    delete user.password;

    return response.json(user);
  }
}
