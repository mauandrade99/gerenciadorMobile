import api from './api';
import axios from 'axios'; 
import type { Address, AddressPayload, ViaCepResponse } from '../types';

export const getAddressesByUserId = async (userId: number): Promise<Address[]> => {
    const response = await api.get<Address[]>(`/api/users/${userId}/addresses`);
    return response.data;
};

export const createAddress = async (userId: number, payload: AddressPayload): Promise<Address> => {
    const response = await api.post<Address>(`/api/users/${userId}/addresses`, payload);
    return response.data;
};

export const updateAddress = async (userId: number, addressId: number, payload: AddressPayload): Promise<Address> => {
    const response = await api.put<Address>(`/api/users/${userId}/addresses/${addressId}`, payload);
    return response.data;
};

export const deleteAddress = async (userId: number, addressId: number): Promise<void> => {
    await api.delete(`/api/users/${userId}/addresses/${addressId}`);
};

// --- Serviço Externo de CEP ---

export const getAddressByCep = async (cep: string): Promise<ViaCepResponse> => {
    const response = await axios.get<ViaCepResponse>(`https://viacep.com.br/ws/${cep}/json/`);
    return response.data;
};