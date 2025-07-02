import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import type { User, Address } from '../../types';
import { Colors } from '../../theme/appStyles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-toast-message';

import { deleteAddress } from '../../services/addressService';
import ConfirmModal from '../modals/ConfirmModal';
import AddressModal from '../modals/AddressModal'; // Importe o novo modal

interface AddressesPanelProps {
  selectedUser: User | null;
  addresses: Address[];
  isLoading: boolean;
  onRefresh: () => void;
}

const AddressesPanel = ({ selectedUser, addresses, isLoading, onRefresh }: AddressesPanelProps) => {
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);
  const [addressToEdit, setAddressToEdit] = useState<Address | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const openAddModal = () => {
    setAddressToEdit(null);
    setIsModalVisible(true);
  };

  const openEditModal = (address: Address) => {
    setAddressToEdit(address);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setAddressToEdit(null);
  };

  const handleSuccess = () => {
    closeModal();
    onRefresh();
  };

  const openDeleteModal = (address: Address) => setAddressToDelete(address);
  const closeDeleteModal = () => setAddressToDelete(null);

  const handleConfirmDelete = async () => {
    if (!addressToDelete || !selectedUser) return;
    try {
      await deleteAddress(selectedUser.id, addressToDelete.id);
      closeDeleteModal();
      onRefresh();
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Não foi possível excluir o endereço.',  position: 'bottom', visibilityTime: 6000, });
      closeDeleteModal();
    }
  };

  const renderAddress = ({ item }: { item: Address }) => (
    <View style={styles.addressItem}>
      <View style={{ flex: 1 }}>
        <Text style={styles.addressStreet}>{item.logradouro}, {item.numero}</Text>
        <Text style={styles.addressDetails}>{item.bairro} - {item.cidade}/{item.estado}</Text>
        <Text style={styles.addressDetails}>CEP: {item.cep}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconButton} onPress={() => openEditModal(item)}>
          <Icon name="pen" size={16} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => openDeleteModal(item)}>
          <Icon name="trash" size={16} color={Colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <View style={styles.panel}>
        <View style={styles.header}>
          <Text style={styles.panelTitle}>
            Endereços de: {selectedUser ? selectedUser.nome : '...'}
          </Text>
          {selectedUser && (
            <TouchableOpacity style={styles.iconButton} onPress={openAddModal}>
              <Icon name="plus" size={20} color={Colors.primary} />
            </TouchableOpacity>
          )}
        </View>
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : (
          <FlatList
            data={addresses}
            renderItem={renderAddress}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<Text style={styles.emptyText}>Nenhum endereço encontrado.</Text>}
            onRefresh={onRefresh}
            refreshing={isLoading}
          />
        )}
      </View>
      
      <AddressModal
        visible={isModalVisible}
        userId={selectedUser?.id || null}
        addressToEdit={addressToEdit}
        onClose={closeModal}
        onSuccess={handleSuccess}
      />

      <ConfirmModal
        visible={!!addressToDelete}
        title="Excluir Endereço"
        message={`Tem certeza que deseja excluir o endereço "${addressToDelete?.logradouro}, ${addressToDelete?.numero}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteModal}
      />
    </>
  );
};

const styles = StyleSheet.create({
  // ... (os estilos do painel permanecem os mesmos)
  panel: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9f9f9', borderTopWidth: 1, borderColor: Colors.border },
  panelTitle: { fontSize: 18, fontWeight: 'bold', padding: 10, color: Colors.text, flex: 1 },
  addressItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderColor: Colors.border },
  addressStreet: { fontSize: 16, fontWeight: '500', color: Colors.text },
  addressDetails: { fontSize: 12, color: Colors.subtleText },
  actions: { flexDirection: 'row' },
  iconButton: { padding: 8 },
  emptyText: { textAlign: 'center', marginTop: 20, color: Colors.subtleText },
});

export default AddressesPanel;