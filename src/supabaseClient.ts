
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config/environment';

// Création du client Supabase avec les clés de l'environnement
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Log pour s'assurer que le client est correctement initialisé
console.log('Supabase client initialized');

export default supabase;
