
import { createClient } from '@supabase/supabase-js';

// Créer le client Supabase avec les variables d'environnement
// Ces valeurs doivent être remplacées par vos vraies clés si vous connectez Supabase
const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseAnonKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
