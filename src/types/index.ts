// Estrutura da resposta de autenticação
export interface AuthResponse {
  token: string;
}

// Estrutura do payload decodificado do JWT
export interface JwtPayload {
  userId: number;
  sub: string; // email do usuário
  authorities: string[]; // ex: ['ROLE_ADMIN', 'ROLE_USER']
  iat: number;
  exp: number;
}

// Estrutura do Usuário
export interface User {
  id: number;
  nome: string;
  email: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN';
}

// Estrutura da resposta paginada da API
export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // Página atual (base 0)
  size: number;
}

// Estrutura do Endereço
export interface Address {
  id: number;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

// Payload para criar/atualizar um endereço
export interface AddressPayload {
  cep: string;
  numero: string;
  complemento?: string;
  frontendOrigin: 4; 
}

// Payload para atualizar um usuário
export interface UserUpdatePayload {
  nome: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN';
  frontendOrigin: 4; 
}

// Estrutura para busca de CEP (ViaCEP)
export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string; // cidade
  uf: string; // estado
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}