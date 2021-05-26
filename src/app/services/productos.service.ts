import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../interfaces/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  cargando = true;
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  constructor(private http:HttpClient) { 
    this.cargarProductos();
  }

  private cargarProductos(){
    return new Promise<void>((resolve,reject) => {
      this.http.get("https://portafolio-e50d7-default-rtdb.firebaseio.com/productos_idx.json").subscribe(
        (resp: Producto[]) => {
          this.productos = resp;
          this.cargando = false;
          resolve();
        });
    });    
  }

  getProducto(id:string){
   return this.http.get(`https://portafolio-e50d7-default-rtdb.firebaseio.com/productos/${id}.json`);
  }

  buscarProducto(termino:string){
    if(this.productos.length === 0){
      this.cargarProductos().then(() => {
        this.filtrarProductos(termino);
      });
    } else {
      this.filtrarProductos(termino);
    }    
  }

  private filtrarProductos(termino:string){
    console.log(termino);
    this.productosFiltrados = [];
    termino = termino.toLocaleLowerCase();
    this.productos.forEach(prod=>{
      const tituloLower = prod.titulo.toLocaleLowerCase();
      const categoriaLower = prod.categoria.toLocaleLowerCase();
      if(categoriaLower.indexOf(termino)>=0 || tituloLower.indexOf(termino)>=0){
        this.productosFiltrados.push(prod);
      }
    })
  }
}
