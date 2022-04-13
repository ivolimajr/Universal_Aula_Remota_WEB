import {AddressModel} from './address.model';
import {User} from './user.model';
import {PhoneNumberModel} from './phoneNumber.model';
import {FileModel} from './file.model';

export class InstructorModel {
    id: number;
    name: string;
    email: string;
    cpf: string;
    origin: string;
    birthdate: string;
    addressId: number;
    address: AddressModel;
    userId: number;
    user: User;
    phonesNumbers: Array<PhoneNumberModel>;
    uf: string;
    cep: string;
    fullAddress: string;
    district: string;
    city: string;
    addressNumber: string;
    complement: string;
    password: string;
    files: FileModel[];
}
