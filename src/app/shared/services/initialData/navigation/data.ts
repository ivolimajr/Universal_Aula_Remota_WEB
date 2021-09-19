/* tslint:disable:max-line-length */
import {FuseNavigationItem} from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'home',
        title: 'Início',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/inicio'
    }
];

export const plataformaNavigation: FuseNavigationItem[] =[
    {
        id: 'edriving',
        title: 'Usuario da Plataforma',
        type: 'basic',
        icon: 'heroicons_outline:academic-cap',
        link: '/usuario/edriving'
    },
    {
        id: 'parceiro',
        title: 'Parceiros',
        type: 'basic',
        icon: 'heroicons_outline:user-group',
        link: '/usuario/parceiro'
    }
];

export const parceiroNavigation: FuseNavigationItem[] =[
    {
        id: 'autoescola',
        title: 'auto-escola',
        type: 'basic',
        icon: 'heroicons_outline:user-group',
        link: '/usuario/auto-escola'
    }
];
