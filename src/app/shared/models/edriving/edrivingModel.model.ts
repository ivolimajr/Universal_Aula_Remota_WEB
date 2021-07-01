import { BaseModel } from '../baseModels/base.model';
import { Cargo } from '../cargo/cargo.model';
import { Usuario } from '../user/usuario.model';

export interface EdrivingModel extends BaseModel {
  cpf: string;
  cargoId: number;
  cargo: string;
}
export class EdrivingPost {
  id: number;
  fullName: string;
  cpf: string;
  email: string;
  telefone: string;
  senha: string;
  status: number;
  cargoid: number;
}
export class EdrivingGetAll {
  id: number;
  fullName: string;
  cpf: string;
  email: string;
  telefone: string;
  cargoId: number;
  cargo: Cargo;
  usuarioId: number;
  usuario: Usuario;
}
