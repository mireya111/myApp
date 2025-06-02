import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonItem, IonLabel} from '@ionic/angular/standalone';
import { AutenticacionService } from '../services/autenticacion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonItem, IonLabel],
})
export class HomePage {
  email : string = '';
  password : string = ''; 
  constructor(private autenticacion: AutenticacionService, private router: Router ) {}
  async registrarUsuario(){
    const userRegistrado = await this.autenticacion.register(this.email, this.password);
    if(userRegistrado){
      alert('Usuario registrado con éxito');
      console.log('Usuario registrado con éxito');
    } else {
      alert('Error al registrar el usuario');
      console.log('Error al registrar el usuario');
    }
  }

  async loginUsuario(){
    const userLogueado = await this.autenticacion.login(this.email, this.password);
    if(userLogueado){
      alert('Usuario logueado con éxito');
      console.log('Usuario logueado con éxito');
      // Aquí podrías redirigir al usuario a otra página, por ejemplo:
      this.router.navigate(['/clima-ciudad']);
    } else {
      alert('Error al loguear el usuario');
      console.log('Error al loguear el usuario');
    }
  }
}
