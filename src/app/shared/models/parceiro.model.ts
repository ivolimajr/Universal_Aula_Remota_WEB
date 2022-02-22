import {Level} from './level.model';
import {User} from './user.model';
import {PhoneNumberModel} from './phoneNumber.model';
import {AddressModel} from './address.model';

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
