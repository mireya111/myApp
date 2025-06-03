import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private bucket = 'imagemensaje';

  constructor() {}

  // Subir imagen y devolver la URL pública
  async uploadImage(file: File): Promise<string | null> {
    const fileName = Date.now() + '_' + file.name;
    // Subir archivo al bucket
    const { error } = await supabase
      .storage
      .from(this.bucket)
      .upload(fileName, file);

    if (error) {
      console.error('Error subiendo imagen:', error);
      return null;
    }

    // Obtener URL pública
    const { data } = supabase
      .storage
      .from(this.bucket)
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  // Guardar mensaje en la tabla con la URL de la imagen
  async sendMessage(email: string, contenido: string, imageFile?: File, fotoPerfilUrl?: string) {
  let url = null; // <-- la imagen del mensaje va en "url"
  if (imageFile) {
    url = await this.uploadImage(imageFile);
  }
  const { error } = await supabase.from('messagesConImage').insert([{
    email,
    contenido,
    url,             // Imagen adjunta al mensaje
    fotoPerfilUrl    // Foto de perfil del usuario
  }]);
  if (error) {
    console.error('Error guardando mensaje:', error);
  }
}

  async getMessages() {
    const { data, error } = await supabase
      .from('messagesConImage')
      .select('*')
      .order('id', { ascending: true });
    if (error) {
      console.error('Error obteniendo mensajes:', error);
      return [];
    }
    return data;
  }

  onNewMessage(callback: (msg: any) => void) {
    supabase
      .channel('public:messagesConImage')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messagesConImage' }, payload => {
        callback(payload.new);
      })
      .subscribe();
  }
}