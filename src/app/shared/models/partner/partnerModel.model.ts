/**
 * Essa é a interface do Parceiro. EX: DetranDF, DetranGO....;
 */
import { BaseModel } from '../base.model';

export interface PartnerModel extends BaseModel {
  id: number; //
  fullName: string; //
  email: string; //
  telefone: string;
  dataAbertura: Date; //
  cnpj: string;
  cep: string;
  endereco: string;
  status: number; //
}