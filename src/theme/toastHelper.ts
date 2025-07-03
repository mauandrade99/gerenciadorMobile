import Toast from 'react-native-root-toast';
import { Colors } from '../theme/appStyles';

// Configurações padrão para todos os Toasts
const defaultOptions = {
  duration: Toast.durations.LONG,
  position: Toast.positions.BOTTOM,
  shadow: false,
  animation: true,
  hideOnPress: true,
  textStyle: {
    fontSize: 14,
    fontWeight: '400' as '400', 
  },
  containerStyle: {
    borderRadius: 10,      
    borderWidth: 2,        
  },
};

// Helper para Toasts de erro
export const showErrorToast = (message: string) => {
  Toast.show(message, {
    ...defaultOptions,
    backgroundColor: Colors.danger,
    textColor: Colors.primaryText,
    containerStyle: {
      ...defaultOptions.containerStyle,
      borderColor: '#A62B1F', 
    },
  });
};

// Helper para Toasts de sucesso
export const showSuccessToast = (message: string) => {
  Toast.show(message, {
    ...defaultOptions,
    backgroundColor: '#28a745', 
    textColor: Colors.primaryText,
    containerStyle: {
      ...defaultOptions.containerStyle,
      borderColor: '#1E7E34', 
    },
  });
};