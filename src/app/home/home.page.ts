import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonItem, IonLabel } from '@ionic/angular/standalone';
import { AutenticacionService } from '../services/autenticacion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonItem, IonLabel],
})
export class HomePage {
  email: string = '';
  password: string = '';
  foto: File | null = null;

  constructor(private autenticacion: AutenticacionService, private router: Router) {}

  onFileSelected(event: any) {
    this.foto = event.target.files[0];
  }

  async registrarUsuario() {
    let fotoUrl = '';
    if (this.foto) {
      fotoUrl = await this.autenticacion.subirFotoASupabase(this.foto, this.email);
    }
    const userRegistrado = await this.autenticacion.register(this.email, this.password, fotoUrl);
    if (userRegistrado) {
      alert('Usuario registrado con éxito');
      console.log('Usuario registrado con éxito');
    } else {
      alert('Error al registrar el usuario');
      console.log('Error al registrar el usuario');
    }
  }

  async loginUsuario() {
    const userLogueado = await this.autenticacion.login(this.email, this.password);
    if (userLogueado) {
      alert('Usuario logueado con éxito');
      console.log('Usuario logueado con éxito');
      this.router.navigate(['/chat']);
    } else {
      alert('Error al loguear el usuario');
      console.log('Error al loguear el usuario');
    }
  }
}
