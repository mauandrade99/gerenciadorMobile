import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';


export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
};