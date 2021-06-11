/**
 * Essa é a interface da Auto Escola.
 */
import { BaseModel } from '../baseModels/base.model';

export interface AdministrativoModel extends BaseModel {
  cargo: string;
  cpf: string;
  identidade: string;
  orgaoExpedidor: string;
  dataNascimento: Date;
  cep: string;
  bairro: string;
  cidade: string;
  uf: string;
  enderecoLogradouro: string;
  numero: string;
  localizacaoLatitude: string;
  longitude: string;
  telefone2: string;
  site: string;

}