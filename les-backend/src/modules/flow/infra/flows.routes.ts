import { Router } from 'express';

import { ensureAuthenticated } from '@shared/middlewares/ensureAuthenticated';

import { CreateFlowController } from '../useCases/CreateFlow/CreateFlowController';
import { FindAllFlowsController } from '../useCases/FindAllFlows/FindAllFlowsController';

export const flowsRouter = Router();

const createFlowController = new CreateFlowController();
const findAllFlowsController = new FindAllFlowsController();

flowsRouter.use(ensureAuthenticated);

flowsRouter.get('/', findAllFlowsController.handle);

flowsRouter.post('/', createFlowController.handle);
