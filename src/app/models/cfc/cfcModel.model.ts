/**
 * Essa é a interface da Auto Escola.
 */
import { BaseModel } from '../base.model';

export interface CfcModel extends BaseModel {
  dateOfBbirth: string;
  dob: Date; // DATA DE ANIVERSÁRIO EM FORMATO DATE
  telefone: string;
  dataAbertura: Date;
  id: number;
  fullName: string;
  email: string;
  status: number;
  cpf: string;
  cep: string;
}