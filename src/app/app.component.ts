import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { AuthService } from './shared/services/auth/auth.service';
@Component({
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private unsubscribe: Subscription[] = [];

  title = 'RXJS';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) {
    if (this.authService.getAuthFromLocalStorage()) {
      this.router.navigate(['/']);
    }
  }
  ngOnInit(): void {
  }

}

