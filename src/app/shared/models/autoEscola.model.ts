import {AddressModel} from './endereco.model';
import {User} from './usuario.model';
import {PhoneNumberModel} from './telefone.model';
import {FileModel} from './arquivo.model';

export class DrivingSchool {
    id: number;
    corporateName: string;
    fantasyName: string;
    stateRegistration: string;
    foundingDate: string;
    email: string;
    description: string;
    site: string;
    cnpj: string;
    addressId: number;
    address: AddressModel;
    userId: number;
    user: User;
    phonesNumbers: Array<PhoneNumberModel>;
}

export class DrivingSchoolPost {
    id: number;
    corporateName: string;
    fantasyName: string;
    stateRegistration: string;
    foundingDate: string;
    email: string;
    description: string;
    site: string;
    cnpj: string;
    uf: string;
    cep: string;
    address: string;
    district: string;
    city: string;
    number: string;
    password: string;
    files: Array<FileModel>;
    phonesNumbers: Array<PhoneNumberModel>;
}
