import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { IngresoEgreso } from '../ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../ingreso-egreso.service';
import Swal from 'sweetalert2';
import * as fromIngresoEgreso from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit, OnDestroy {
  items: IngresoEgreso[];
  subscription: Subscription = new Subscription();

  constructor( private store: Store<fromIngresoEgreso.AppState>, public ingresoEgresoService: IngresoEgresoService ) { }

  ngOnInit() {
    this.subscription = this.store.select('ingresoEgreso').subscribe( ingresoEgreso => {
      this.items = ingresoEgreso.items;
    } );
  }

  borrarItem( item: any ) {
    this.ingresoEgresoService.borrarIngresoEgreso( item.uid ).then(() => {
      Swal('Eliminado', item.descripcion, 'success');
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
