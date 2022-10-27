import { Router } from 'express';

import { AuthenticateUserController } from '../useCases/AuthenticateUser/AuthenticateUserController';

export const authRouter = Router();

const authenticateUserController = new AuthenticateUserController();

authRouter.post('/', authenticateUserController.handle);
