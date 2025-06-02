import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'; 
import { HttpClient } from '@angular/common/http';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ApiClimaService {
  private apiKey = environment.apiKey;
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(private http: HttpClient, private firestore: Firestore) {}

  obtenerElClimaDeCiudad(ciudad: string) {
    const url = `${this.apiUrl}?q=${ciudad}&appid=${this.apiKey}&units=metric`;
    return this.http.get(url);
  }

  guardarCiudadBuscada(clima: any) {
    // Aquí podrías implementar la lógica para guardar la ciudad buscada
    const climaColleccion = collection(this.firestore, 'climas');
    // Se añade a la collección 'climas' en Firestore
    return addDoc(climaColleccion, clima)
  }
}
