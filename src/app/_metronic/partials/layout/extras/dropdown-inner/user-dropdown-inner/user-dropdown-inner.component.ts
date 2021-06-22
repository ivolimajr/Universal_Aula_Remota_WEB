import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LayoutService } from '../../../../../core';
import { BaseModel } from '../../../../../../shared/models/baseModels/base.model';
import { AuthService } from '../../../../../../shared/services/auth/auth.service';
@Component({
  selector: 'app-user-dropdown-inner',
  templateUrl: './user-dropdown-inner.component.html',
  styleUrls: ['./user-dropdown-inner.component.scss'],
})
export class UserDropdownInnerComponent implements OnInit {
  extrasUserDropdownStyle: 'light' | 'dark' = 'light';
  user$: BaseModel;

  constructor(private layout: LayoutService, private auth: AuthService) { }

  ngOnInit(): void {
    this.extrasUserDropdownStyle = this.layout.getProp(
      'extras.user.dropdown.style'
    );
    this.user$ = this.auth.getAuthFromLocalStorage();
  }

  logout() {
    this.auth.logout();
    document.location.reload();
  }
}
