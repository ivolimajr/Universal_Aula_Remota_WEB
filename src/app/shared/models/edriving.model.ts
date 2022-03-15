import {Level} from './level.model';
import {User} from './user.model';
import {PhoneNumberModel} from './phoneNumber.model';

export class EdrivingModel {
    id: number;
    name: string;
    cpf: string;
    email: string;
    phonesNumbers: Array<PhoneNumberModel>;
    levelId: number;
    level: Level;
    userId: number;
    user: User;
    password?: string;
    status?: number;
}
