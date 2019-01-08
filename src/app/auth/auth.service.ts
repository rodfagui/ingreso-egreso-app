import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import Swal from 'sweetalert2';
import { User } from './user.model';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.actions';
import { SetUserAction, UnsetUserAction } from './auth.actions';

import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubscription: Subscription = new Subscription();
  private usuario: User;

  constructor( private afAuth: AngularFireAuth,
              private router: Router,
              private afDB: AngularFirestore,
              private store: Store<AppState> ) { }

  initAuthListener() {
    this.afAuth.authState.subscribe( fbUser => {
      if ( fbUser ) {
        this.userSubscription = this.afDB.doc(`${ fbUser.uid }/usuario`).valueChanges().subscribe( (usuarioObj: any) => {
          const newUser = new User( usuarioObj );
          const accion = new SetUserAction( newUser );
          this.store.dispatch( accion );
          this.usuario = newUser;
        });
      } else {
        this.usuario = null;
        this.userSubscription.unsubscribe();
      }
    });
  }

  crearUsuario( nombre, correo, password ) {
    const activarAccion = new ActivarLoadingAction();
    this.store.dispatch( activarAccion );

    const desactivarAccion = new DesactivarLoadingAction();

    this.afAuth.auth.createUserWithEmailAndPassword( correo, password ).then( resp => {
      const user: User = {
        uid: resp.user.uid,
        email: resp.user.email,
        nombre: nombre
      };
      this.afDB.doc(`${user.uid}/usuario`).set(user).then(() => {
        this.router.navigate(['/']);
        this.store.dispatch( desactivarAccion );
      });
    }).catch( error => {
      this.store.dispatch( desactivarAccion );
      Swal('Error en el registro', error.message, 'error');
    });
  }

  login( correo, password ) {
    const activarAccion = new ActivarLoadingAction();
    this.store.dispatch( activarAccion );

    const desactivarAccion = new DesactivarLoadingAction();

    this.afAuth.auth.signInWithEmailAndPassword( correo, password ).then( resp => {
      this.router.navigate(['/']);
      this.store.dispatch( desactivarAccion );
    }).catch( error => {
      this.store.dispatch( desactivarAccion );
      Swal('Error en el login', error.message, 'error');
    });
  }

  logout() {
    const accion = new UnsetUserAction();
    this.store.dispatch( accion );
    this.router.navigate(['/login']);
    this.afAuth.auth.signOut();
  }

  isAuth() {
    return this.afAuth.authState.pipe(map( fbUser => {
      if (fbUser == null) {
        this.router.navigate(['/login']);
      }
      return fbUser !== null;
    }));
  }

  getUsuario() {
    return { ...this.usuario };
  }
}
