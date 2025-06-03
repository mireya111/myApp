import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonText, IonButton } from '@ionic/angular/standalone';
import { GeolocalizacionService } from '../../servicio/geolocalizacion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-geolocalizacion',
  templateUrl: './geolocalizacion.page.html',
  styleUrls: ['./geolocalizacion.page.scss'],
  standalone: true,
imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonText,
    IonButton,
    CommonModule,
    FormsModule
  ]})
export class GeolocalizacionPage implements OnInit {
  latitud: number | null = null;
  longitud: number | null = null;

  constructor(private servicioGPS: GeolocalizacionService, private router: Router) { }

  ngOnInit() {
  }

  async ubicacion() {
    const ubi = await this.servicioGPS.obtenerUbicacion();
    this.latitud = ubi?.latitud || null;
    this.longitud = ubi?.longitud || null;
    if(ubi !== null) {
      console.log('Ubicación obtenida:', this.latitud, this.longitud);
    }
  }
  async guardarUbicacion() {
    await this.servicioGPS.guardarUbicacion();
    alert('Ubicación guardada correctamente');
  }

  async abrirEnGoogleMaps() {
    await this.ubicacion();
    if (this.latitud && this.longitud) {
      const url = `https://www.google.com/maps?q=${this.latitud},${this.longitud}`;
      window.open(url, '_blank');
    }
  }

}
