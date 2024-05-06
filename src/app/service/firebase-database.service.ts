import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDatabaseService {

  urlPerros = 'https://petpalooza-e50e0-default-rtdb.firebaseio.com/perros.json'
  urlGatos = 'https://petpalooza-e50e0-default-rtdb.firebaseio.com/gatos.json'

  mascotas: any[] = []
  carga = false

  constructor(private http: HttpClient,) {
  }

  getGatos(): Observable<any[]> {
    return this.http.get<any[]>(this.urlGatos);
  }

  getPerros(): Observable<any[]> {
    return this.http.get<any[]>(this.urlPerros);
  }
}
