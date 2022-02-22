import {FuseNavigationItem} from '@fuse/components/navigation';
import {User} from 'app/shared/models/user.model';

export interface InitialData {
    navigation: {
        compact: FuseNavigationItem[];
        default: FuseNavigationItem[];
        futuristic: FuseNavigationItem[];
        horizontal: FuseNavigationItem[];
    };
    // user: Usuario;
}
