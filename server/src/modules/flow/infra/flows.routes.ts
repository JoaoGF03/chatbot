import { Router } from 'express';

import { ensureAuthenticated } from '@shared/middlewares/ensureAuthenticated';

import { CreateFlowController } from '../useCases/CreateFlow/CreateFlowController';
import { DeleteFlowController } from '../useCases/DeleteFlow/DeleteFlowController';
import { FindAllFlowsController } from '../useCases/FindAllFlows/FindAllFlowsController';
import { UpdateFlowController } from '../useCases/UpdateFlow/UpdateFlowController';

export const flowsRouter = Router();

const createFlowController = new CreateFlowController();
const findAllFlowsController = new FindAllFlowsController();
const updateFlowController = new UpdateFlowController();
const deleteFlowController = new DeleteFlowController();

flowsRouter.use(ensureAuthenticated);

flowsRouter.get('/', findAllFlowsController.handle);

flowsRouter.post('/', createFlowController.handle);

flowsRouter.put('/:id', updateFlowController.handle);

flowsRouter.delete('/:id', deleteFlowController.handle);
