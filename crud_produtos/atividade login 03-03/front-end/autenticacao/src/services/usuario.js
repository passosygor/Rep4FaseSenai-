import { api } from "./api";

export const cadastroApi = async (form) => {
    try {
        const response = await api.post('/usuario', form);
        return response.data;
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        throw error;
    }
}