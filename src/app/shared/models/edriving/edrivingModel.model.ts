import { BaseModel } from '../baseModels/base.model';

export interface EdrivingModel extends BaseModel {
  cpf: string;
  cargoId: number;
  cargo: string;
}
