import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import type { User, Page } from '../../types';
import { Colors } from '../../theme/appStyles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-toast-message';

import { deleteUser } from '../../services/userService';
import ConfirmModal from '../modals/ConfirmModal';
import UserEditModal from '../modals/UserEditModal'; // Importe o novo modal

interface UsersPanelProps {
  usersPage: Page<User> | null;
  isLoading: boolean;
  selectedUserId?: number | null;
  onSelectUser: (user: User) => void;
  onRefresh: () => void;
}

const UsersPanel = ({ usersPage, isLoading, selectedUserId, onSelectUser, onRefresh }: UsersPanelProps) => {
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  const openEditModal = (user: User) => setUserToEdit(user);
  const closeEditModal = () => setUserToEdit(null);

  const handleEditSuccess = () => {
    closeEditModal();
    onRefresh();
  };

  const openDeleteModal = (user: User) => setUserToDelete(user);
  const closeDeleteModal = () => setUserToDelete(null);

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete.id);
      closeDeleteModal();
      onRefresh();
    } catch (error) {
      Toast.show({type: 'error', text1: "Não foi possível excluir o usuário.",  position: 'bottom', visibilityTime: 6000, });
      closeDeleteModal();
    }
  };

  const renderUser = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={[styles.userItem, selectedUserId === item.id && styles.selectedItem]}
      onPress={() => onSelectUser(item)}
    >
      <View>
        <Text style={styles.userName}>{item.nome}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconButton} onPress={() => openEditModal(item)}>
          <Icon name="pen" size={16} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => openDeleteModal(item)}>
          <Icon name="trash" size={16} color={Colors.danger} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Usuários</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : (
          <FlatList
            data={usersPage?.content || []}
            renderItem={renderUser}
            keyExtractor={(item) => item.id.toString()}
            onRefresh={onRefresh}
            refreshing={isLoading}
            ListEmptyComponent={<Text style={styles.emptyText}>Nenhum usuário encontrado.</Text>}
          />
        )}
      </View>

      <UserEditModal
        visible={!!userToEdit}
        userToEdit={userToEdit}
        onClose={closeEditModal}
        onSuccess={handleEditSuccess}
      />

      <ConfirmModal
        visible={!!userToDelete}
        title="Excluir Usuário"
        message={`Tem certeza que deseja excluir o usuário "${userToDelete?.nome}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteModal}
      />
    </>
  );
};

const styles = StyleSheet.create({
  // ... (os estilos do painel permanecem os mesmos)
  panel: { flex: 1, borderBottomWidth: 1, borderColor: Colors.border },
  panelTitle: { fontSize: 18, fontWeight: 'bold', padding: 10, backgroundColor: '#f9f9f9', color: Colors.text },
  userItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderColor: Colors.border },
  selectedItem: { backgroundColor: Colors.primary + '20' },
  userName: { fontSize: 16, fontWeight: '500', color: Colors.text },
  userEmail: { fontSize: 12, color: Colors.subtleText },
  actions: { flexDirection: 'row' },
  iconButton: { padding: 8 },
  emptyText: { textAlign: 'center', marginTop: 20, color: Colors.subtleText },
});

export default UsersPanel;