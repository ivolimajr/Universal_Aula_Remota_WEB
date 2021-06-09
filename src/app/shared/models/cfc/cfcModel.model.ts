/**
 * Essa é a interface da Auto Escola.
 */
import { BaseModel } from '../base.model';

export interface CfcModel extends BaseModel {
  id: number;
  fullName: string;
  email: string;
  cpf: string;
  cep: string;
  endereco: string;
  dataAbertura: Date;
  status: number;
}