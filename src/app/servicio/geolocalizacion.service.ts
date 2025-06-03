import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation'
//import { supabase } from '../supabase.client';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class GeolocalizacionService {
  latitud: number | null = null;
  longitud: number | null = null;
  constructor(private firestore: Firestore) {}

  async obtenerUbicacion() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      this.latitud = coordinates.coords.latitude;
      this.longitud = coordinates.coords.longitude;
      console.log('Latitud:', this.latitud, 'Longitud:', this.longitud);
      return { latitud: this.latitud, longitud: this.longitud };
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
      return null;
    }
  }

  async guardarUbicacion() {
    if (this.latitud === null || this.longitud == null) {
      console.log('No se ha obtenido la ubicación');
      return;
    }
    try {
      const ubicacionesRef = collection(this.firestore, 'ubicacionesMensajes');
      await addDoc(ubicacionesRef, {
        latitud: this.latitud,
        longitud: this.longitud,
        fecha: new Date()
      });
      console.log('Ubicación guardada en Firebase');
    } catch (error) {
      console.error('Error al guardar la ubicación en Firebase:', error);
    }
  }
}
