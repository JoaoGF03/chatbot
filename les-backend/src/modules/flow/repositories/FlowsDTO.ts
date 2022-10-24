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
  name?: string;
  message?: string;
  userId: string;
  buttons?: {
    id: string;
    name: string;
  }[];
}
