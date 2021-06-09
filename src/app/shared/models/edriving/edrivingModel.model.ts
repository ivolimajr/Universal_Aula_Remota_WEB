import { BaseModel } from '../base.model';

export interface EdrivingModel extends BaseModel {
  id: number; // ID de cada usuáriodo sistema quanto para o nome do C.F.Cacesso a plataforma.
  dateOfBbirth: string;
  dob: Date; // DATA DE ANIVERSÁRIO EM FORMATO DATE
  cargo: string;
  cpf: string;
}
