/**
 * Essa é a interface da Auto Escola.
 */
import { BaseModel } from '../baseModels/base.model';

export interface AdministrativoModel extends BaseModel {
  cargo: string;
  cpf: string;
  cep: string;
  bairro: string;
  cidade: string;
  uf: string;
  enderecoLogradouro: string;
  numero: string;
  identidade: string;
  orgaoExpedidor: string;
  dataNascimento: Date;
  localizacaoLatitude: string;
  longitude: string;
  site: string;

}