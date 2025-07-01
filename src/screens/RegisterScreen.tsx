import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, SafeAreaView,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { globalStyles, Colors } from '../theme/appStyles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useAuth } from '../hooks/useAuth';
import { registerUser } from '../services/authService';

type RegisterScreenProps = {
  navigation: {
    navigate: (screen: string) => void;
    goBack: () => void;
  };
};

const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const auth = useAuth();

  const handleRegister = async () => {
    if (!nome || !email || !senha || !confirmarSenha) {
      Alert.alert("Erro de Validação", "Todos os campos são obrigatórios.");
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert("Erro de Validação", "As senhas não coincidem.");
      return;
    }

    setIsLoading(true);
    try {
      const data = await registerUser({ nome, email, senha });
      // Após o registro, faz o login automático
      await auth.login(data.token);
      // A navegação para o dashboard será automática devido à mudança de estado
    } catch (err: any) {
      Alert.alert("Falha no Registro", err.response?.data?.message || "Não foi possível criar a conta.");
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
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={globalStyles.title}>Crie sua Conta</Text>
          <Text style={globalStyles.subtitle}>É rápido e fácil</Text>

          <TextInput
            style={globalStyles.input}
            placeholder="Nome Completo"
            value={nome}
            onChangeText={setNome}
            placeholderTextColor={Colors.subtleText}
          />

          <TextInput
            style={globalStyles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={Colors.subtleText}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.inputWithIcon}
              placeholder="Senha"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!isPasswordVisible}
              placeholderTextColor={Colors.subtleText}
            />
            <TouchableOpacity onPress={() => setIsPasswordVisible(p => !p)} style={styles.icon}>
              <Icon name={isPasswordVisible ? 'eye-slash' : 'eye'} size={20} color={Colors.subtleText} />
            </TouchableOpacity>
          </View>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.inputWithIcon}
              placeholder="Confirmar Senha"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry={!isConfirmPasswordVisible}
              placeholderTextColor={Colors.subtleText}
            />
            <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(p => !p)} style={styles.icon}>
              <Icon name={isConfirmPasswordVisible ? 'eye-slash' : 'eye'} size={20} color={Colors.subtleText} />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color={Colors.primary} style={styles.buttonPlaceholder} />
          ) : (
            <TouchableOpacity style={globalStyles.button} onPress={handleRegister}>
              <Text style={globalStyles.buttonText}>Registrar</Text>
            </TouchableOpacity>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Já tem uma conta?</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={globalStyles.linkText}> Faça o login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Reutilizamos muitos estilos globais, mas adicionamos alguns específicos
const styles = StyleSheet.create({
  keyboardView: { flex: 1 },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginBottom: 15,
  },
  inputWithIcon: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: Colors.text,
  },
  icon: { padding: 15 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20, paddingBottom: 20 },
  footerText: { color: Colors.subtleText, fontSize: 14 },
  buttonPlaceholder: { padding: 18, marginTop: 10 },
});

export default RegisterScreen;