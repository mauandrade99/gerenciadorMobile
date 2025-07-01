import { StyleSheet } from 'react-native';

// 1. Defina sua paleta de cores em um só lugar
export const Colors = {
  background: '#F8F6F2',
  card: '#FFFFFF',
  text: '#3D352F',
  subtleText: '#857D75',
  primary: '#B99C75',
  primaryText: '#FFFFFF',
  warning: '#E3D1B4',
  danger: '#C38673',
  border: '#EAE5E0',
};

// 2. Crie um StyleSheet com estilos reutilizáveis
export const globalStyles = StyleSheet.create({
  // --- Layout ---
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  // --- Tipografia ---
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.subtleText,
    textAlign: 'center',
    marginBottom: 40,
  },
  linkText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },

  // --- Componentes de Formulário ---
  input: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    color: Colors.text,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: Colors.primaryText,
    fontSize: 16,
    fontWeight: '600',
  },
});