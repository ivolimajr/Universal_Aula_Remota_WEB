import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LayoutService } from '../../../../../core';
import { BaseModel } from '../../../../../../shared/models/baseModels/base.model';
import { AuthService } from '../../../../../../shared/services/auth/auth.service';
import { StorageServices } from '../../../../../../shared/services/storage/localStorage.service';
import { environment } from '../../../../../../../environments/environment';
@Component({
  selector: 'app-user-dropdown-inner',
  templateUrl: './user-dropdown-inner.component.html',
  styleUrls: ['./user-dropdown-inner.component.scss'],
})
export class UserDropdownInnerComponent implements OnInit {
  extrasUserDropdownStyle: 'light' | 'dark' = 'light';
  user$: BaseModel;
  private authLocalStorageAuth = `${environment.appVersion}-${environment.AuthStorage}`;

  constructor(private layout: LayoutService, private storageServices: StorageServices, private auth: AuthService) { }

  ngOnInit(): void {
    this.extrasUserDropdownStyle = this.layout.getProp(
      'extras.user.dropdown.style'
    );
    this.user$ = this.storageServices.getAuthFromLocalStorage(this.authLocalStorageAuth)
  }

  logout() {
    this.auth.logout();
    document.location.reload();
  }
}
