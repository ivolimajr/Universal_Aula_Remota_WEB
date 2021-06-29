import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { environment } from '../environments/environment';
import { StorageServices } from './shared/services/storage/localStorage.service';
@Component({
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private unsubscribe: Subscription[] = [];

  title = 'RXJS';
  private authLocalStorageAuth = `${environment.appVersion}-${environment.AuthStorage}`;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
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

