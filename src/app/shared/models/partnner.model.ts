import {Level} from './level.model';
import {User} from './user.model';
import {PhoneNumberModel} from './phoneNumber.model';
import {AddressModel} from './address.model';

export class PartnnerModel {
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
    password: string;
}
