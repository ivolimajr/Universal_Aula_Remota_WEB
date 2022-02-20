import {FuseNavigationItem} from '@fuse/components/navigation';
import {User} from 'app/shared/models/usuario.model';

export interface InitialData {
    navigation: {
        compact: FuseNavigationItem[];
        default: FuseNavigationItem[];
        futuristic: FuseNavigationItem[];
        horizontal: FuseNavigationItem[];
    };
    // user: Usuario;
}
