/**
 * Essa é a interface da Auto Escola.
 */
import { BaseModel } from '../base.model';

export interface CfcModel extends BaseModel {
  cargo: any;
  dob: any;
  cnpj: string;
  InscricaoEstadual: string;
  dataAbertura: Date; //
  cep: string;
  endereco: string;
  status: number; //
  RazaoSocial: string;
  NomeFantasia: string;
  site:string;
  detran:string;
}