import { Flow } from '@prisma/client';

export interface ICreateFlowDTO {
  name: string;
  message: string;
  userId: string;
  buttons: {
    id: string;
    name: string;
  }[];
}

export interface IUpdateFlowDTO {
  id: string;
  userId: string;
  name?: string;
  oldName?: string;
  message?: string;
  buttons?: {
    id: string;
    name: string;
  }[];
}

export type IFindFlowByNameDTO = Flow & {
  buttons: {
    name: string;
    id: string;
  }[];
};
