import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView
} from 'react-native';
import { Colors, globalStyles } from '../../theme/appStyles';
import type { Address, AddressPayload } from '../../types';
import { createAddress, updateAddress, getAddressByCep } from '../../services/addressService';
import { showErrorToast } from '../../theme/toastHelper'; 

interface AddressModalProps {
  visible: boolean;
  userId: number | null;
  addressToEdit: Address | null;
  onClose: () => void;
  onSuccess: () => void;
}

const AddressModal = ({ visible, userId, addressToEdit, onClose, onSuccess }: AddressModalProps) => {
  const isEditing = !!addressToEdit;
  const [formData, setFormData] = useState({
    cep: '', numero: '', complemento: '', logradouro: '', bairro: '', cidade: '', estado: ''
  });
  const [isCepLoading, setIsCepLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      if (isEditing && addressToEdit) {
        setFormData({ ...addressToEdit });
      } else {
        setFormData({ cep: '', numero: '', complemento: '', logradouro: '', bairro: '', cidade: '', estado: '' });
      }
    }
  }, [visible, addressToEdit, isEditing]);

  const handleCepChange = async (cep: string) => {
    const numericCep = cep.replace(/\D/g, '');
    setFormData(prev => ({ ...prev, cep: numericCep }));
    if (numericCep.length === 8) {
      setIsCepLoading(true);
      try {
        const data = await getAddressByCep(numericCep);
        if (data.erro) throw new Error();
        setFormData(prev => ({ ...prev, logradouro: data.logradouro, bairro: data.bairro, cidade: data.localidade, estado: data.uf }));
      } catch (error) {
        showErrorToast('CEP não encontrado');
      } finally {
        setIsCepLoading(false);
      }
    }
  };

  const handleSubmit = async () => {
    if (!userId || !formData.cep || !formData.numero) {
      showErrorToast('CEP e Número são obrigatórios.');
      return;
    }
    setIsSaving(true);
    const payload: AddressPayload = { cep: formData.cep, numero: formData.numero, complemento: formData.complemento, frontendOrigin: 4 };
    try {
      if (isEditing && addressToEdit) {
        await updateAddress(userId, addressToEdit.id, payload);
      } else {
        await createAddress(userId, payload);
      }
      onSuccess();
    } catch (error) {
      showErrorToast('Não foi possível salvar o endereço.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal transparent={true} visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ScrollView style={{width: '100%'}}>
            <Text style={styles.modalTitle}>{isEditing ? 'Editar' : 'Adicionar'} Endereço</Text>
            
            <Text style={styles.label}>CEP</Text>
            <View style={styles.cepContainer}>
              <TextInput
                style={[globalStyles.input, styles.cepInput]}
                placeholder="00000-000"
                keyboardType="numeric"
                maxLength={8}
                value={formData.cep}
                onChangeText={handleCepChange}
              />
              {isCepLoading && <ActivityIndicator color={Colors.primary} />}
            </View>

            <Text style={styles.label}>Logradouro</Text>
            <TextInput style={[globalStyles.input, styles.disabledInput]} value={formData.logradouro} editable={false} />

            <Text style={styles.label}>Número</Text>
            <TextInput style={globalStyles.input} value={formData.numero} onChangeText={text => setFormData(p => ({ ...p, numero: text }))} />

            <Text style={styles.label}>Complemento</Text>
            <TextInput style={globalStyles.input} value={formData.complemento} onChangeText={text => setFormData(p => ({ ...p, complemento: text }))} />

            <Text style={styles.label}>Bairro</Text>
            <TextInput style={[globalStyles.input, styles.disabledInput]} value={formData.bairro} editable={false} />

            <Text style={styles.label}>Cidade</Text>
            <TextInput style={[globalStyles.input, styles.disabledInput]} value={formData.cidade} editable={false} />

            <Text style={styles.label}>Estado</Text>
            <TextInput style={[globalStyles.input, styles.disabledInput]} value={formData.estado} editable={false} />

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
  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.1)' },
  modalView: { width: '90%', maxHeight: '80%', backgroundColor: 'white', borderRadius: 10, padding: 20, alignItems: 'center' },
  modalTitle: { ...globalStyles.title, fontSize: 22, marginBottom: 20 },
  label: { alignSelf: 'flex-start', color: Colors.subtleText, marginBottom: 5, marginLeft: 5 },
  disabledInput: { backgroundColor: '#f0f0f0', color: Colors.subtleText },
  cepContainer: { flexDirection: 'row', alignItems: 'center' },
  cepInput: { flex: 1, marginRight: 10 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 20 },
  button: { padding: 18, borderRadius: 8, flex: 1, alignItems: 'center', marginTop: 10 },
  cancelButton: { backgroundColor: '#e0e0e0' },
  saveButton: { flex: 1 },
});

export default AddressModal;

