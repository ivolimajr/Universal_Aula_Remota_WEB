import {RoleModel} from './role.model';

export class User {
    id?: number;
    name: string;
    email: string;
    status: number;
    password?: string;
    roles: Array<RoleModel>;
}

export class UserLogin {
    email: string;
    password: string;
}
