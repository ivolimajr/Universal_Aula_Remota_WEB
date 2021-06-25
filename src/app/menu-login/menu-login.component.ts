import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { localStorage } from '../../app/_metronic/core/utils/localstorage';

@Component({
  selector: 'app-menu-login',
  templateUrl: './menu-login.component.html'
})
export class MenuLoginComponent {

  token: string = "";
  user: any;
  email: string = "";
  localStorageUtils = new localStorage();

  constructor(private router: Router) {  }

  usuarioLogado(): boolean {
    this.user = this.localStorageUtils.obterUsuario();

    if (this.user)
      this.email = this.user.email;

    return this.token !== null;
  }

  logout() {
    this.router.navigate(['/dashboard']);
  }
}
