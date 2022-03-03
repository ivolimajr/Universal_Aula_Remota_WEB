import {FuseNavigationItem} from '@fuse/components/navigation';

export interface InitialData {
    navigation: {
        compact: FuseNavigationItem[];
        default: FuseNavigationItem[];
        futuristic: FuseNavigationItem[];
        horizontal: FuseNavigationItem[];
    };
}
