import {RoleModel} from './role.model';
import {AddressModel} from './address.model';

export class User {
    id?: number;
    userId: number;
    name: string;
    email: string;
    status: number;
    password?: string;
    roles: Array<RoleModel>;
    address: AddressModel;
}

export class UserLogin {
    email: string;
    password: string;
}
