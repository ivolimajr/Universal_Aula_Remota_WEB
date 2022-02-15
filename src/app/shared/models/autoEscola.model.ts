import {Endereco} from './endereco.model';
import {Usuario} from './usuario.model';
import {Telefone} from './telefone.model';
import {Arquivo, ArquivoUpdate} from './arquivo.model';

export class AutoEscolaUsuario {
    id: number;
    razaoSocial: string;
    nomeFantasia: string;
    inscricaoEstadual: string;
    dataFundacao: string;
    email: string;
    descricao: string;
    site: string;
    cnpj: string;
    enderecoId: number;
    endereco: Endereco;
    usuarioId: number;
    usuario: Usuario;
    telefones: Array<Telefone>;
}

export class AutoEscolaPost {
    id: number;
    razaoSocial: string;
    nomeFantasia: string;
    inscricaoEstadual: string;
    dataFundacao: string;
    email: string;
    descricao: string;
    site: string;
    cnpj: string;
    uf: string;
    cep: string;
    enderecoLogradouro: string;
    bairro: string;
    cidade: string;
    numero: string;
    senha: string;
    arquivos: Array<Arquivo>;
    telefones: Array<Telefone>;
}
