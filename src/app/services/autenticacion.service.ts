import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {

  constructor() {}

  async subirFotoASupabase(file: File, email: string): Promise<string> {
    const filePath = `fotos_perfil/${email}_${Date.now()}`;
    const { error } = await supabase.storage.from('perfilesimage').upload(filePath, file);
    if (error) return '';
    const { data: publicUrlData } = supabase.storage.from('perfilesimage').getPublicUrl(filePath);
    return publicUrlData?.publicUrl || '';
  }

  async register(email: string, password: string, fotoUrl: string) {
    // 1. Crea el usuario en Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    if (error || !data.user) return null;

    // 2. Guarda el email y la url en la tabla usuarios
    const { error: insertError } = await supabase
      .from('usuarios')
      .insert([{ email, url: fotoUrl }]);
    if (insertError) return null;

    return data.user;
  }

  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return null;
    return data.user;
  }

  async getUsuarioActual() {
    const { data } = await supabase.auth.getUser();
    return data?.user || null;
  }

  async getPerfilUsuario(email: string) {
    return await supabase.from('usuarios').select('url').eq('email', email);
  }

  async logout() {
    await supabase.auth.signOut();
  }
}