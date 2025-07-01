import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Usaremos o Picker padrão para o select
import { Colors, globalStyles } from '../../theme/appStyles';
import type { User, UserUpdatePayload } from '../../types';
import { updateUser } from '../../services/userService';

interface UserEditModalProps {
  visible: boolean;
  userToEdit: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

const UserEditModal = ({ visible, userToEdit, onClose, onSuccess }: UserEditModalProps) => {
  const [nome, setNome] = useState('');
  const [role, setRole] = useState<'ROLE_USER' | 'ROLE_ADMIN'>('ROLE_USER');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (userToEdit) {
      setNome(userToEdit.nome);
      setRole(userToEdit.role);
    }
  }, [userToEdit]);

  const handleSubmit = async () => {
    if (!userToEdit || !nome) {
      Alert.alert("Erro", "O nome do usuário é obrigatório.");
      return;
    }
    setIsSaving(true);
    const payload: UserUpdatePayload = { nome, role, frontendOrigin: 3 };
    try {
      await updateUser(userToEdit.id, payload);
      onSuccess();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar o usuário.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal transparent={true} visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ScrollView style={{width: '100%'}}>
            <Text style={styles.modalTitle}>Editar Usuário</Text>
            
            <Text style={styles.label}>Nome</Text>
            <TextInput style={globalStyles.input} value={nome} onChangeText={setNome} />

            <Text style={styles.label}>Email (não pode ser alterado)</Text>
            <TextInput style={[globalStyles.input, styles.disabledInput]} value={userToEdit?.email || ''} editable={false} />

            <Text style={styles.label}>Permissão</Text>
            <View style={styles.pickerContainer}>
                <Picker
                selectedValue={role}
                onValueChange={(itemValue) => setRole(itemValue)}
                style={styles.picker}
                >
                <Picker.Item label="Usuário Comum" value="ROLE_USER" />
                <Picker.Item label="Administrador" value="ROLE_ADMIN" />
                </Picker>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose} disabled={isSaving}>
                <Text>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[globalStyles.button, styles.saveButton]} onPress={handleSubmit} disabled={isSaving}>
                {isSaving ? <ActivityIndicator color="#fff" /> : <Text style={globalStyles.buttonText}>Salvar</Text>}
                </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

// Estilos locais para o modal
const styles = StyleSheet.create({
  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { width: '90%', backgroundColor: 'white', borderRadius: 10, padding: 20, alignItems: 'center' },
  modalTitle: { ...globalStyles.title, fontSize: 22, marginBottom: 20 },
  label: { alignSelf: 'flex-start', color: Colors.subtleText, marginBottom: 5, marginLeft: 5 },
  disabledInput: { backgroundColor: '#f0f0f0', color: Colors.subtleText },
  pickerContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: Colors.card,
  },
  picker: {
    width: '100%',
  },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 20 },
  button: { padding: 15, borderRadius: 8, flex: 1, alignItems: 'center', marginHorizontal: 5 },
  cancelButton: { backgroundColor: '#e0e0e0' },
  saveButton: { flex: 1 },
});

export default UserEditModal;