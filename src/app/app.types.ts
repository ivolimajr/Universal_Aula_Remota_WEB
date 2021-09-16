import {FuseNavigationItem} from '@fuse/components/navigation';
import {Usuario} from 'app/shared/models/usuario.model';

export interface InitialData {
    navigation: {
        compact: FuseNavigationItem[];
        default: FuseNavigationItem[];
        futuristic: FuseNavigationItem[];
        horizontal: FuseNavigationItem[];
    };
    // user: Usuario;
}
