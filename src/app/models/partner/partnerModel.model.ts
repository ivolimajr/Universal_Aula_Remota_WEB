/**
 * Essa é a interface do Parceiro. EX: DetranDF, DetranGO....;
 */
import { BaseModel } from '../base.model';

export interface PartnerModel extends BaseModel {
  dateOfBbirth: string;
  telefone: string;
  dataAbertura: Date; //
  id: number; //
  fullName: string; //
  email: string; //
  status: number; //
  cpf: string;
  cep: string;
}