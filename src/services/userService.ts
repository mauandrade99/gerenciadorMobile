import api from './api';
import type { User, Page, UserUpdatePayload } from '../types';

export const getUserById = async (userId: number): Promise<User> => {
  const response = await api.get<User>(`/api/users/${userId}`);
  return response.data;
};

export const getUsers = async (page: number, size: number): Promise<Page<User>> => {
    const response = await api.get<Page<User>>(`/api/users?page=${page}&size=${size}`);
    return response.data;
};

export const updateUser = async (userId: number, payload: UserUpdatePayload): Promise<User> => {
    const response = await api.put<User>(`/api/users/${userId}`, payload);
    return response.data;
};

export const deleteUser = async (userId: number): Promise<void> => {
    await api.delete(`/api/users/${userId}`);
};