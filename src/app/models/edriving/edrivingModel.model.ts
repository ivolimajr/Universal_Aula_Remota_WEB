import { BaseModel } from '../base.model';

export interface EdrivingModel extends BaseModel {
  dateOfBbirth: string;
  dob: Date; // DATA DE ANIVERSÁRIO EM FORMATO DATE
}
