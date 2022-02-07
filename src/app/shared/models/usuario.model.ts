import {RoleModel} from './role.model';

export class Usuario {
    id?: number;
    nome: string;
    email: string;
    status: number;
    nivelAcesso: number;
    password?: string;
    roles: Array<RoleModel>;
}

export class UsuarioLogin {
    email: string;
    password: string;
}
