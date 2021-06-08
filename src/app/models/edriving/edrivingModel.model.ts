import { BaseModel } from '../base.model';

export interface EdrivingModel extends BaseModel {
  dateOfBbirth: string;
  dob: Date; // DATA DE ANIVERSÁRIO EM FORMATO DATE
  telefone: string;
  id: number; // ID de cada usuário
  fullName: string; // Esse atributo valerá tanto para o nome do usuário do sistema quanto para o nome do C.F.C
  email: string; // Esse atributo será o email de contato e o Email de acesso a plataforma.
  status: number; // Active = 1 | Suspended = 2 | Pending = 3
}
