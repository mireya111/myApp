import {createClient} from "@supabase/supabase-js";
import { environment } from '../environments/environment';
//Supabase puede ser 
export const supabase=createClient(environment.supabaseURL, environment.supabaseKey);