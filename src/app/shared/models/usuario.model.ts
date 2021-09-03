export class Usuario {
    id?: number;
    nome: string;
    email: string;
    status: number;
    nivelAcesso: number;
    password?: string;
}

export class UsuarioLogin {
    email: string;
    password: string;
}
