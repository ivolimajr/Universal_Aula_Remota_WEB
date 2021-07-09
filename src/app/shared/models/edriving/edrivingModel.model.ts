import { BaseModel } from '../baseModels/base.model';
import { Cargo } from '../cargo/cargo.model';
import { Usuario } from '../user/usuario.model';

export class EdrivingPost {
  id: number;
  fullName: string;
  cpf: string;
  email: string;
  telefone: string;
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
