import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, StatusBar  } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import type { User, Address, Page } from '../types';
import { getUsers } from '../services/userService';
import { getAddressesByUserId } from '../services/addressService';
import { globalStyles, Colors } from '../theme/appStyles';
import Icon from 'react-native-vector-icons/FontAwesome5';

import UsersPanel from '../components/dashboard/UsersPanel';
import AddressesPanel from '../components/dashboard/AddressesPanel';

const DashboardScreen = () => {
  const { user: loggedInUser, isAdmin, logout } = useAuth();
  const [usersPage, setUsersPage] = useState<Page<User> | null>(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

  const fetchUsers = async (page: number = 0) => {
    if (!isAdmin) return;
    setIsLoadingUsers(true);
    try {
      const data = await getUsers(page, 500);  // sem paginação!!!
      setUsersPage(data);
    } catch (error) { console.error("Erro ao buscar usuários:", error); }
    finally { setIsLoadingUsers(false); }
  };

  const fetchAddresses = async (user: User) => {
    setIsLoadingAddresses(true);
    setAddresses([]);
    try {
      const data = await getAddressesByUserId(user.id);
      setAddresses(data);
    } catch (error) { console.error("Erro ao buscar endereços:", error); }
    finally { setIsLoadingAddresses(false); }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    } else if (loggedInUser) {
      setSelectedUser(loggedInUser);
    }
  }, [isAdmin, loggedInUser]);

  useEffect(() => {
    if (selectedUser) {
      fetchAddresses(selectedUser);
    }
  }, [selectedUser]);

  const refreshData = () => {
    if (isAdmin) fetchUsers(usersPage?.number || 0);
    if (selectedUser) fetchAddresses(selectedUser);
  };

  const handleLogout = () => {
    console.log("Botão de Sair clicado. Chamando a função logout...");
    logout();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bem-vindo, {loggedInUser?.nome}!</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Icon name="sign-out-alt" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {isAdmin ? (
          <>
            <View style={styles.panelContainer}>
              <UsersPanel
                usersPage={usersPage}
                isLoading={isLoadingUsers}
                onSelectUser={setSelectedUser}
                selectedUserId={selectedUser?.id}
                onRefresh={fetchUsers}
                loggedInUserId={loggedInUser?.id}
              />
            </View>
            <View style={styles.panelContainer}>
              <AddressesPanel
                selectedUser={selectedUser}
                addresses={addresses}
                isLoading={isLoadingAddresses}
                onRefresh={refreshData}
              />
            </View>
          </>
        ) : (
          <AddressesPanel
            selectedUser={selectedUser}
            addresses={addresses}
            isLoading={isLoadingAddresses}
            onRefresh={refreshData}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background, 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background, 
    paddingTop: 30,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  container: {
    flex: 1,
  },
  panelContainer: {
    flex: 1, 
  },
  logoutButton: {
    padding: 8, 
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DashboardScreen;