import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { environment } from '../environments/environment';
import { StorageServices } from './shared/services/storage/localStorage.service';
@Component({
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {

  private authLocalStorageAuth = `${environment.appVersion}-${environment.AuthStorage}`;

  constructor(
    private router: Router,
    private storageServices: StorageServices,
  ) {
    if (this.storageServices.getAuthFromLocalStorage(this.authLocalStorageAuth)) {
      this.router.navigate(['/']);
    }
  }
  ngOnInit(): void {
  }

}

