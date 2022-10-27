import { container } from 'tsyringe';

import { IFlowsRepository } from '../repositories/IFlowsRepository';
import { FlowsRepository } from '../repositories/implementations/FlowsRepository';

container.registerSingleton<IFlowsRepository>(
  'FlowsRepository',
  FlowsRepository,
);
