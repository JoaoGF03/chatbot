import { Router } from 'express';

import { buttonsRouter } from '@modules/button/infra/buttons.routes';
import { flowsRouter } from '@modules/flow/infra/flows.routes';
import { authRouter } from '@modules/user/infra/auth.routes';
import { usersRouter } from '@modules/user/infra/users.routes';

export const routes = Router();

routes.use('/users', usersRouter);
routes.use('/auth', authRouter);
routes.use('/flows', flowsRouter);
routes.use('/buttons', buttonsRouter);
