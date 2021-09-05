import {Cargo} from './cargo.model';
import {Usuario} from './usuario.model';
import {Telefone} from './Telefone.model';
import {Endereco} from './endereco.model';

export class ParceiroUsuario {
    id: number;
    nome: string;
    email: string;
    descricao: string;
    cnpj: string;
    cargoId: number;
    cargo: Cargo;
    enderecoId: number;
    endereco: Endereco;
    usuarioId: number;
    usuario: Usuario;
    telefones: Array<Telefone>;
}

export class ParceiroPost {
    id?: number;
    nome: string;
    email: string;
    cnpj: string;
    descricao: string;
    senha: string;
    cargoId: number;
    uf: string;
    cep: string;
    enderecoLogradouro: string;
    bairro: string;
    cidade: string;
    numero: string;
    telefones: Array<Telefone>;
}
