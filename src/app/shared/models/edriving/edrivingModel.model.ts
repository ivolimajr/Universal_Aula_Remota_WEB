import { BaseModel } from '../base.model';

export interface EdrivingModel extends BaseModel {
  cep: string;
  cpf: string;
  dateOfBbirth: string;
  dob: Date; // DATA DE ANIVERSÁRIO EM FORMATO DATE
  cargo: string;
  endereco:string;
  email: string;
  fullName: string;
  telefone:string;
  senha:string;
  confirmarSenha:string;
  sobrenome:string;

}
