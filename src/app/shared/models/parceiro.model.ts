import {Level} from './cargo.model';
import {User} from './usuario.model';
import {PhoneNumberModel} from './Telefone.model';
import {AddressModel} from './endereco.model';

export class PartnnerUser {
    id: number;
    name: string;
    email: string;
    description: string;
    cnpj: string;
    levelId: number;
    level: Level;
    addressId: number;
    address: AddressModel;
    userId: number;
    user: User;
    phonesNumbers: Array<PhoneNumberModel>;
}

export class PartnnerPost {
    id?: number;
    name: string;
    email: string;
    cnpj: string;
    description: string;
    password: string;
    levelId: number;
    uf: string;
    cep: string;
    address: string;
    district: string;
    city: string;
    number: string;
    phonesNumbers: Array<PhoneNumberModel>;
}
