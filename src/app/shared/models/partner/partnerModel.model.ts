/**
 * Essa é a interface do Parceiro. EX: DetranDF, DetranGO....;
 */
import { BaseModel } from '../base.model';

export interface PartnerModel extends BaseModel {
  cargo: any;
  dataAbertura: Date; //
  cnpj: string;
  cep: string;
  endereco: string;
  status: number; //
  RazaoSocial: string;
  NomeFantasia: string;
  InscricaoEstadual: string;
  site:string;
  detran:string;
}