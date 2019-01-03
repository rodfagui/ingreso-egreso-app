import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { User } from './user.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( private afAuth: AngularFireAuth, private router: Router, private afDB: AngularFirestore ) { }

  initAuthListener() {
    this.afAuth.authState.subscribe( fbUser => {
      console.log(fbUser);
    });
  }

  crearUsuario( nombre, correo, password ) {
    this.afAuth.auth.createUserWithEmailAndPassword( correo, password ).then( resp => {
      const user: User = {
        uid: resp.user.uid,
        email: resp.user.email,
        nombre: nombre
      };
      this.afDB.doc(`${user.uid}/usuario`).set(user).then(() => {
        this.router.navigate(['/']);
      });
    }).catch( error => {
      Swal('Error en el registro', error.message, 'error');
    });
  }

  login( correo, password ) {
    this.afAuth.auth.signInWithEmailAndPassword( correo, password ).then( resp => {
      console.log(resp);
      this.router.navigate(['/']);
    }).catch( error => {
      Swal('Error en el login', error.message, 'error');
    });
  }

  logout() {
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
}
