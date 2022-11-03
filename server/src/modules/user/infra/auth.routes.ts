import { Router } from 'express';

import { AuthenticateUserController } from '../useCases/AuthenticateUser/AuthenticateUserController';
import { ResetPasswordController } from '../useCases/ResetPassword/ResetPasswordController';
import { SendForgotPasswordMailController } from '../useCases/SendForgotPasswordMail/SendForgotPasswordMailController';

export const authRouter = Router();

const authenticateUserController = new AuthenticateUserController();
const resetPasswordController = new ResetPasswordController();
const forgotPasswordController = new SendForgotPasswordMailController();

authRouter.post('/', authenticateUserController.handle);
authRouter.post('/resetPassword', resetPasswordController.handle);
authRouter.post('/forgotPassword', forgotPasswordController.handle);
