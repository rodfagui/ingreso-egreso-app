export class IngresoEgreso {
  public descripcion: string;
  public monto: number;
  public tipo: string;

  constructor( obj: DataObj ) {
    this.descripcion = obj && obj.descripcion || null;
    this.monto = obj && obj.monto || null;
    this.tipo = obj && obj.tipo || null;
  }
}

interface DataObj {
  descripcion: string;
  monto: number;
  tipo: string;
}
