import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  cargando: boolean;
  subscription: Subscription = new Subscription();

  constructor( private authService: AuthService,
              private store: Store<AppState> ) { }

  ngOnInit() {
    this.subscription = this.store.select('ui').subscribe(ui => {
      this.cargando = ui.isLoading;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit( data: any ) {
    this.authService.login( data.correo, data.password );
  }
}
