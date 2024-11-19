import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xwhvvbueavhkbuaoujcb.supabase.co'; // URL do seu Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3aHZ2YnVlYXZoa2J1YW91amNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4OTQ4MjQsImV4cCI6MjA0NzQ3MDgyNH0.6jnaT_cluYkYyOUQQ2T55FhHPcMmr_JUUuinEI6QJAE'; // Chave pública de autenticação

export const supabase = createClient(supabaseUrl, supabaseKey);
