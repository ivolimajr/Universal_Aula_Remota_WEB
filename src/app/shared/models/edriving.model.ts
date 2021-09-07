import {Cargo} from './cargo.model';
import {Usuario} from './usuario.model';
import {Telefone} from './Telefone.model';

export class EdrivingUsuario {
    id: number;
    nome: string;
    cpf: string;
    email: string;
    telefones: Array<Telefone>;
    cargoId: number;
    cargo: Cargo;
    usuarioId: number;
    usuario: Usuario;
}

export class EdrivingPost {
    id?: number;
    nome: string;
    cpf: string;
    email: string;
    telefones: Array<Telefone>;
    cargoId: number;
    status: number;
    senha?: string;
}
