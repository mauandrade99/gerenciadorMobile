import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

import { useAuth } from '../hooks/useAuth'; 
import { loginUser } from '../services/authService'; 
import Toast from 'react-native-toast-message';

import { globalStyles, Colors } from '../theme/appStyles';
import Icon from 'react-native-vector-icons/FontAwesome5';

type LoginScreenProps = {
  navigation: {
    navigate: (screen: string) => void;
  };
};

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const auth = useAuth(); // Pegue o contexto de autenticação

  // TODO: Conectar com o useAuth para a lógica de login real
  const handleLogin = async () => {
    if (!email || !senha) {
      Toast.show({type: 'error', text1: "Por favor, preencha o email e a senha.",  position: 'bottom', visibilityTime: 6000, });
      return;
    }
    setIsLoading(true);
    try {
      // 1. Chama o serviço da API
      const data = await loginUser({ email, senha });

      // 2. Chama a função de login do nosso contexto, que vai atualizar o estado global
      await auth.login(data.token);

      // 3. NÃO há mais navigation.navigate() aqui. A navegação é automática.

    } catch (err: any) {
      Toast.show({type: 'error', text1: err.response?.data?.message || "Credenciais inválidas.",  position: 'bottom', visibilityTime: 6000, });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={globalStyles.container}>
          <Text style={globalStyles.title}>Bem-vindo!</Text>
          <Text style={globalStyles.subtitle}>Faça login para continuar</Text>

          <TextInput
            style={globalStyles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={Colors.subtleText}
          />

          {/* Campo de Senha com Ícone */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.inputWithIcon}
              placeholder="Senha"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!isPasswordVisible}
              placeholderTextColor={Colors.subtleText}
            />
            <TouchableOpacity 
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              style={styles.icon}
            >
              <Icon 
                name={isPasswordVisible ? 'eye-slash' : 'eye'} 
                size={20} 
                color={Colors.subtleText} 
              />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color={Colors.primary} style={styles.buttonPlaceholder} />
          ) : (
            <TouchableOpacity style={globalStyles.button} onPress={handleLogin}>
              <Text style={globalStyles.buttonText}>Entrar</Text>
            </TouchableOpacity>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Não tem uma conta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={globalStyles.linkText}> Registre-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Estilos específicos para esta tela, complementando os globais
const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // Reutiliza o estilo do input global, mas sem a margem inferior
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginBottom: 15,
  },
  inputWithIcon: {
    // Removemos o estilo visual do TextInput para que o container o controle
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: Colors.text,
  },
  icon: {
    padding: 15,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: Colors.subtleText,
    fontSize: 14,
  },
  // Placeholder para o ActivityIndicator ter a mesma altura do botão
  buttonPlaceholder: {
    padding: 18,
    marginTop: 10,
  }
});

export default LoginScreen;