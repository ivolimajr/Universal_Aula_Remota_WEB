/**
 * Essa é a interface da Auto Escola.
 */
import { BaseModel } from '../baseModels/base.model';

export interface StudentBaseModel extends BaseModel {

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
    telefone: string;
    curso: [];
    turno:string;
    turma:string;
    status:number;
}