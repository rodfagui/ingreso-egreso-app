import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ordenIngresoEgreso'
})
export class OrdenIngresoEgresoPipe implements PipeTransform {

  transform(items: any[]): any[] {
    return items.sort( (a, b) => {
      if ( a.tipo === 'ingreso') {
        return -1;
      } else {
        return 1;
      }
    });
  }

}
