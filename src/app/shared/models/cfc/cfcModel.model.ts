/**
 * Essa é a interface da Auto Escola.
 */
import { BaseModel } from '../baseModels/base.model';

export interface CfcModel extends BaseModel {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual: string;
  datadaFundacao: Date; //
  cep: string;
  bairro: string;
  cidade: string;
  uf: string;
  enderecoLogradouro: string;
  numero: string;
  localizacaoLatitude: string;
  longitude: string;
  telefone: string;
  site: string;
  email: string;
  uploadDOC:string;

}