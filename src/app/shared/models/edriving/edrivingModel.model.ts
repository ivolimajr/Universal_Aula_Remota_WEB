import { BaseModel } from '../base.model';

export interface EdrivingModel extends BaseModel {
  cpf: string;
  dateOfBbirth: string;
  dob: Date; // DATA DE ANIVERSÁRIO EM FORMATO DATE
  cargo: string;
}
