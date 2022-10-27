import { Flow } from '@prisma/client';

import { ICreateFlowDTO, IUpdateFlowDTO } from './FlowsDTO';

export interface IFlowsRepository {
  create(data: ICreateFlowDTO): Promise<Flow>;
  findById(id: string): Promise<Flow>;
  findAll(userId: string): Promise<Flow[]>;
  findByName(name: string, userId: string): Promise<Flow>;
  update(data: IUpdateFlowDTO): Promise<void>;
  delete(id: string): Promise<void>;
}
