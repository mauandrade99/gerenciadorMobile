export interface LoginCredentials {
    email: string;
    senha?: string; 
}

export interface RegisterPayload extends LoginCredentials {
    nome: string;
} 