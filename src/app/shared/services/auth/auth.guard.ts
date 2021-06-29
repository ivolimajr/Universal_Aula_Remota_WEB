import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { environment } from '../../../../environments/environment';
import { StorageServices } from '../storage/localStorage.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService,
    private storageServices: StorageServices) { }

  private authLocalStorageAuth = `${environment.appVersion}-${environment.AuthStorage}`;

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.storageServices.getAuthFromLocalStorage(this.authLocalStorageAuth);
    if (currentUser) {
      return true;
    }

    this.authService.logout();
    return false;
  }
}
