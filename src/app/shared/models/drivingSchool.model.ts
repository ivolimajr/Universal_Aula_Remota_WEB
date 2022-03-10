import {AddressModel} from './address.model';
import {User} from './user.model';
import {PhoneNumberModel} from './phoneNumber.model';
import {FileModel} from './file.model';

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
    addressNumber: string;
    password: string;
    files: Array<FileModel>;
    phonesNumbers: Array<PhoneNumberModel>;
}
