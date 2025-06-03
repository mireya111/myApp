import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation'
import { supabase } from '../supabase.client';

@Injectable({
  providedIn: 'root'
})
export class GeolocalizacionService {
  latitud: number | null = null;
  longitud: number | null = null;
  supabase: any;
  constructor() { 
  }

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
    if(this.latitud === null || this.longitud == null){
      console.log('No se ha obtenido la ubicación');
      return;
    } 
    else {
      try{
        const { data, error } = await supabase
          .from('ubicaciones')
          .insert([
            { latitud: this.latitud, longitud: this.longitud }
          ]);
        if (error) {
          console.error('Error al guardar la ubicación:', error);
        } else {
          console.log('Ubicación guardada:', data);
        }
      } catch(error) {
        console.error('Error al guardar la ubicación:', error);
      }
    }
  }
}
