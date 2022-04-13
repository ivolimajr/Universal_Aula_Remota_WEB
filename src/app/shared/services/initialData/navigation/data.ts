/* tslint:disable:max-line-length */
import {FuseNavigationItem} from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'home',
        title: 'Início',
        type: 'basic',
        icon: 'heroicons_outline:home',
        link: '/inicio'
    }
];

export const edrivingNavigation: FuseNavigationItem[] = [
    {
        id: 'edriving',
        title: 'Usuario da Plataforma',
        type: 'basic',
        icon: 'heroicons_outline:star',
        link: '/usuario/edriving'
    },
    {
        id: 'parceiro',
        title: 'Parceiros',
        type: 'basic',
        icon: 'heroicons_outline:office-building',
        link: '/usuario/parceiro'
    }
];

export const partnnerNavigation: FuseNavigationItem[] = [
    {
        id: 'autoescola',
        title: 'Auto Escolas',
        type: 'basic',
        icon: 'heroicons_outline:truck',
        link: '/usuario/auto-escola'
    }
];

export const drivingSchoolNavigation: FuseNavigationItem[] = [
    {
        id: 'administrativo',
        title: 'Administrativos',
        type: 'basic',
        icon: 'heroicons_outline:book-open',
        link: '/usuario/administrativo'
    }
];
export const administrativeNavigation: FuseNavigationItem[] = [
    {
        id: 'instrutor',
        title: 'Instrutores',
        type: 'basic',
        icon: 'heroicons_outline:book-open',
        link: '/usuario/instrutor'
    }
];
