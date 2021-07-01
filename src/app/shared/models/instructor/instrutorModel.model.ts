import { BaseModel } from '../baseModels/base.model';
export interface InstrutorBaseModel extends BaseModel {

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
    telefone: string;
    site: string;
    cursos: [];
    uploadDOC:string;
}