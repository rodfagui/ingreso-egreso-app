import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Subscription } from 'rxjs';
import { IngresoEgreso } from '../ingreso-egreso.model';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styleUrls: ['./estadistica.component.css']
})
export class EstadisticaComponent implements OnInit {
  ingresos: number;
  egresos: number;

  cuentaIngresos: number;
  cuentaEgresos: number;

  subscription: Subscription = new Subscription();

  doughnutChartLabels: string[] = ['Ingresos', 'Egresos'];
  doughnutChartData: number[] = [0, 0];
  doughnutChartType = 'doughnut';
  doughnutChartColors: any[] = [
    {
      backgroundColor: ['rgba(40,167,69,0.6)', 'rgba(255,0,0,0.6)'],
    }
  ];

  constructor( private store: Store<AppState> ) { }

  ngOnInit() {
    this.subscription = this.store.select('ingresoEgreso')
                            .subscribe( ingresoEgreso => {
                              this.contarIngresoEgreso( ingresoEgreso.items );
                            });
  }

  contarIngresoEgreso( items: IngresoEgreso[] ) {
    this.ingresos = 0;
    this.egresos = 0;

    this.cuentaIngresos = 0;
    this.cuentaEgresos = 0;

    items.forEach( item => {
      if (item.tipo === 'ingreso') {
        this.cuentaIngresos ++;
        this.ingresos += item.monto;
      } else {
        this.cuentaEgresos ++;
        this.egresos += item.monto;
      }
    });
    this.doughnutChartData = [this.ingresos, this.egresos];
  }

}
