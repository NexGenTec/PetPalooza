import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HuachitoService {
  baseUrl = 'https://huachitos.cl/api';

  constructor(private http: HttpClient) { }

  getAnimales(): Observable<any> {
    return this.http.get(`${this.baseUrl}/animales`);
  }

  getAnimalesPorEstado(estado: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/animales/estado/${estado}`);
  }

  getAnimalesPorTipo(tipo: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/animales/tipo/${tipo}`);
  }

  getAnimalesPorRegion(regionId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/animales/region/${regionId}`);
  }

  getAnimalPorId(animalId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/animal/${animalId}`);
  }

  getEquipos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/equipos`);
  }

  getEquipoPorId(equipoId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/equipo/${equipoId}`);
  }
}
