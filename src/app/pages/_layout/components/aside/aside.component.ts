import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { environment } from 'src/environments/environment';
import { StorageServices } from '../../../../shared/services/storage/localStorage.service';
import { LayoutService } from '../../../../_metronic/core';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss'],
})
export class AsideComponent implements OnInit {
  disableAsideSelfDisplay: boolean;
  headerLogo: string;
  brandSkin: string;
  ulCSSClasses: string;
  location: Location;
  asideMenuHTMLAttributes: any = {};
  asideMenuCSSClasses: string;
  asideMenuDropdown;
  brandClasses: string;
  asideMenuScroll = 1;
  asideSelfMinimizeToggle = false;
  router: any;
  nivelAcesso: number;

  private authLocalStorageAuth = `${environment.appVersion}-${environment.AuthStorage}`;
  constructor(private layout: LayoutService, private loc: Location, private storageService: StorageServices, private auth: AuthService) { }

  ngOnInit(): void {
    // load view settings
    this.disableAsideSelfDisplay =
      this.layout.getProp('aside.self.display') === false;
    this.brandSkin = this.layout.getProp('brand.self.theme');
    this.headerLogo = this.getLogo();
    this.ulCSSClasses = this.layout.getProp('aside_menu_nav');
    this.asideMenuCSSClasses = this.layout.getStringCSSClasses('aside_menu');
    this.asideMenuHTMLAttributes = this.layout.getHTMLAttributes('aside_menu');
    this.asideMenuDropdown = this.layout.getProp('aside.menu.dropdown') ? '1' : '0';
    this.brandClasses = this.layout.getProp('brand');
    this.asideSelfMinimizeToggle = this.layout.getProp(
      'aside.self.minimize.toggle'
    );
    this.asideMenuScroll = this.layout.getProp('aside.menu.scroll') ? 1 : 0;
    this.location = this.loc;

    if (this.storageService.getAuthFromLocalStorage(this.authLocalStorageAuth)) {
      let result = this.storageService.getAuthFromLocalStorage(this.authLocalStorageAuth);
      this.nivelAcesso = result.nivelAcesso;
    }
  }

  private getLogo() {
    return './assets/media/logos/logo-edriving-sm.png';
  }
  logout() {
    this.auth.logout();
    document.location.reload();
    this.router.navigate(['/dashboard']);
  }
}
