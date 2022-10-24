import { Router } from 'express';

import { ensureAuthenticated } from '@shared/middlewares/ensureAuthenticated';

import { CreateButtonController } from '../useCases/CreateButton/CreateButtonController';
import { FindAllButtonsController } from '../useCases/FindAllButtons/FindAllButtonsController';

export const buttonsRouter = Router();

const createButtonController = new CreateButtonController();
const findAllButtonsController = new FindAllButtonsController();

buttonsRouter.use(ensureAuthenticated);

buttonsRouter.post('/', createButtonController.handle);

buttonsRouter.get('/', findAllButtonsController.handle);
