/**
 * Essa é a interface do Parceiro. EX: DetranDF, DetranGO....;
 */
import { BaseModel } from '../baseModels/base.model';
export interface PartnerModel extends BaseModel {
  cargo: string;
  descricao: string;
  cnpj: string;
  cep: string;
  bairro: string;
  cidade: string;
  uf: string;
  enderecoLogradouro: string;
  numero: string;
}