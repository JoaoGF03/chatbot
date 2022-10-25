import { Router } from 'express';

import { ensureAuthenticated } from '@shared/middlewares/ensureAuthenticated';

import { FindAllButtonsController } from '../useCases/FindAllButtons/FindAllButtonsController';

export const buttonsRouter = Router();

const findAllButtonsController = new FindAllButtonsController();

buttonsRouter.use(ensureAuthenticated);

buttonsRouter.get('/', findAllButtonsController.handle);
