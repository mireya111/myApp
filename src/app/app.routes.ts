import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'clima-ciudad',
    loadComponent: () => import('./clima-ciudad/clima-ciudad.page').then( m => m.ClimaCiudadPage)
  },
  {
    path: 'geolocalizacion',
    loadComponent: () => import('./paginas/geolocalizacion/geolocalizacion.page').then( m => m.GeolocalizacionPage)
  },
  {
    path: 'chat',
    loadComponent: () => import('./paginas/chat/chat.page').then( m => m.ChatPage)
  },
];
