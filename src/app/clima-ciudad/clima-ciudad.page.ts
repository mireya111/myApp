import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonText, IonInput, IonItem, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButtons } from '@ionic/angular/standalone';
import { ApiClimaService } from '../services/api-clima.service';
import { AutenticacionService } from '../services/autenticacion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clima-ciudad',
  templateUrl: './clima-ciudad.page.html',
  styleUrls: ['./clima-ciudad.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonText, IonInput,
    IonItem, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButtons,
    CommonModule, FormsModule
  ]
})
export class ClimaCiudadPage implements OnInit {
  ciudad: string = '';
  clima: any = null;
  error: string = '';

  constructor(
    private apiClima: ApiClimaService,
    private autenticacion: AutenticacionService,
    private router: Router
  ) { }

  ngOnInit() {}

  buscarClima() {
    this.apiClima.obtenerElClimaDeCiudad(this.ciudad).subscribe({
      next: (data) => {
        this.clima = data;
        this.error = '';
        alert(`Clima de ${this.ciudad} obtenido con éxito`);
        console.log('Clima obtenido:', this.clima);
        // Guardar en Firestore
        this.apiClima.guardarCiudadBuscada(this.clima)
        .then(() => console.log('Clima guardado en Firestore'))
        .catch(err => console.error('Error al guardar clima:', err));
    
      },
      error: (err) => {
        this.error = 'Ciudad no encontrada o error en la consulta';
        this.clima = null;
        alert(this.error);
        console.error('Error al obtener el clima:', err);
      }
    });
  }

  async cerrarSesion() {
    await this.autenticacion.logout();
    this.router.navigate(['/home']);
  }

  async irAubicacion() {
    await this.router.navigate(['/geolocalizacion']);
  }
}
