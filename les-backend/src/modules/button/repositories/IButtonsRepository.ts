import { Button } from '@prisma/client';

import { ICreateButtonDTO, IFindAllButtonsDTO } from './ButtonsDTO';

export interface IButtonsRepository {
  create(data: ICreateButtonDTO): Promise<Button>;
  findById(id: string): Promise<Button>;
  findAll(userId: string): Promise<IFindAllButtonsDTO[]>;
  findByName(name: string, userId: string): Promise<Button>;
}
