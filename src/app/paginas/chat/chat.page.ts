import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutenticacionService } from '../../services/autenticacion.service';
import { GeolocalizacionService } from '../../servicio/geolocalizacion.service';
import { ApiClimaService } from '../../services/api-clima.service';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonButton 
} from '@ionic/angular/standalone';
import { ChatService } from '../../servicio/chat.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    CommonModule,
    FormsModule
  ]
})
export class ChatPage implements OnInit {
  mensajes: any[] = [];
  contenido: string = '';
  imagen: File | null = null;
  email: string = ''; 
  fotoUrl: string = '';
  ciudadClima: string = '';

  constructor(private chatService: ChatService, private autenticacion: AutenticacionService, private geolocalizacion: GeolocalizacionService, private apiClimaService: ApiClimaService ) {}

  async ngOnInit() {
    // Obtén el usuario actual desde Supabase Auth
    const user = await this.autenticacion.getUsuarioActual();
    if (user) {
      this.email = user.email as string;
      // Busca la URL de la foto en la tabla usuarios
      const { data } = await this.autenticacion.getPerfilUsuario(this.email);
      this.fotoUrl = data?.[0]?.url || '';
    }

    this.mensajes = await this.chatService.getMessages() || [];
    this.chatService.onNewMessage((msg) => {
      this.mensajes.push(msg);
    });
  }

  onFileSelected(event: any) {
    this.imagen = event.target.files[0];
  }

  async enviarMensaje() {
    if (!this.contenido && !this.imagen) return;
    await this.chatService.sendMessage(
      this.email,
      this.contenido,
      this.imagen || undefined,
      this.fotoUrl // <-- pasa la foto de perfil
    );
    this.contenido = '';
    this.imagen = null;
  }

  async enviarUbicacionComoMensaje() {
  const ubi = await this.geolocalizacion.obtenerUbicacion();
  if (ubi) {
    const contenido = `Ubicación: https://www.google.com/maps?q=${ubi.latitud},${ubi.longitud}`;
    await this.chatService.sendMessage(
      this.email,
      contenido,
      undefined,      // No hay imagen adjunta
      this.fotoUrl    // Foto de perfil
    );
    // Guardar también en Firebase
    await this.geolocalizacion.guardarUbicacion();
    alert('Ubicación enviada y guardada en Firebase');
  } else {
    alert('No se pudo obtener la ubicación');
  }
}

async tomarFotoYEnviar() {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      // Convierte la imagen a un archivo File
      const response = await fetch(image.dataUrl!);
      const blob = await response.blob();
      const file = new File([blob], `foto_chat_${Date.now()}.jpeg`, { type: 'image/jpeg' });

      // Usa el mismo flujo que enviarMensaje
      await this.chatService.sendMessage(
        this.email,
        '', // sin texto
        file,
        this.fotoUrl
      );
      alert('Imagen enviada');
    } catch (error) {
      alert('No se pudo capturar la imagen');
      console.error(error);
    }
  }

  async enviarClimaComoMensaje() {
  if (!this.ciudadClima) {
    alert('Escribe una ciudad');
    return;
  }
  try {
    const clima: any = await this.apiClimaService.obtenerElClimaDeCiudad(this.ciudadClima).toPromise();
    const mensajeClima = `Clima en ${clima.name}: ${clima.weather[0].description}, ${clima.main.temp}°C`;
    await this.chatService.sendMessage(
      this.email,
      mensajeClima,
      undefined,
      this.fotoUrl
    );
    // Guardar en Firestore (opcional)
    await this.apiClimaService.guardarCiudadBuscada(clima);
    this.ciudadClima = '';
  } catch (error) {
    alert('No se pudo obtener el clima');
  }
}
}