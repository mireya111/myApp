import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  email: string = 'usuario@ejemplo.com'; // Cambia esto por el email real del usuario

  constructor(private chatService: ChatService) {}

  async ngOnInit() {
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
    await this.chatService.sendMessage(this.email, this.contenido, this.imagen || undefined);
    this.contenido = '';
    this.imagen = null;
  }
}