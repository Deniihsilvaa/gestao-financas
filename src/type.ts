import  { ReactNode } from 'react';
import {  User } from '@supabase/auth-js'; // Importando os tipos corretos do Supabase
export interface AuthContextType {
    currentUser: User | null;
  }
  
  // Tipando as props do AuthProvider
  export interface AuthProviderProps {
    children: ReactNode;
  }