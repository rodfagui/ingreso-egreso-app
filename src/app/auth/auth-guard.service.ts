import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { AuthService } from './auth.service';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanLoad {

  constructor( public authService: AuthService ) { }

  canLoad() {
    return this.authService.isAuth().pipe(take(1));
  }
}
