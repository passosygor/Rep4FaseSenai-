import { api } from "./api";

export const loginApi = async (form) => {
    console.log(form);
    
    try {
        const response = await api.post('/login', form );
        return response.data;
    } catch (error) {
        console.error("Ocorreu um erro! Mensagem: ", error?.response?.data || error.message);
        alert("Ocorreu um erro! " + (error?.response?.data.message ));
    }
}