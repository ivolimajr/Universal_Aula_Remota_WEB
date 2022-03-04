import {User} from './user.model';
import {PhoneNumberModel} from './phoneNumber.model';
import {AddressModel} from './address.model';
import {DrivingSchool} from './drivingSchool.model';

export class AdministrativeUser {
    id: number;
    name: string;
    cpf: string;
    email: string;
    identity: string;
    origin: string;
    birthDate: string;
    addressId: number;
    address: AddressModel;
    phonesNumbers: Array<PhoneNumberModel>;
    drivingSchoolId: number;
    drivingSchool: DrivingSchool;
    userId: number;
    user: User;
}

export class AdministrativePost {
    id?: number;
    name: string;
    cpf: string;
    email: string;
    identity: string;
    origin: string;
    birthDate: string;
    addressId: number;
    address: AddressModel;
    phonesNumbers: Array<PhoneNumberModel>;
    drivingSchoolId: number;
    drivingSchool: DrivingSchool;
    userId: number;
    user: User;
}
