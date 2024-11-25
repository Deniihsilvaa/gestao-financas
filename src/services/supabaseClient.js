// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true, // Garante que as sessões sejam persistidas
      autoRefreshToken: true, // Renova o token automaticamente
    },
    db: {
      schema: 'public', // Define o schema como "public"
    },
    realtime: {
      params: {
        eventsPerSecond: 10, // Define o número de eventos por segundo
      },
    },
    storage: {
      params: {
        cacheControl: '3600', // Define o cache control para 1 hora
      },
    },
    
  });