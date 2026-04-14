import { useState } from "react";
import { loginApi } from "../services/login";
import {  useNavigate } from "react-router";

const Login = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: '',
        senha: ''
    });

    const handdleSubmit = async (e) => {
        e.preventDefault();
        console.log(form);

        try {
            const response = await loginApi(form);
            if(response.success)
                alert('Login realizado com sucesso!');
            
			// Redirecionar para a página de cadastro ou exibir mensagem de sucesso
			navigate('/cadastro');
        } catch (error) {
            console.log(error);
        }
    }
    

    return (
        <>
            <div className="container">
                <div className="card login-card mx-auto" style={{padding: '20px', margin: '20px'}}>
                    <form onSubmit={handdleSubmit}>
                        <h3 className="text-center mb-4">Login</h3>
                        
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">E-mail</label>
                            <input type="email" className="form-control" id="email" placeholder="nome@exemplo.com" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}/>
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="senha" className="form-label">Senha</label>
                            <input type="password" className="form-control" id="senha" placeholder="******" required value={form.senha} onChange={(e) => setForm({...form, senha: e.target.value})} />
                        </div>
                        
                        <button type="submit" className="btn btn-primary w-100" >Entrar</button>
                        
                        <div className="text-center mt-3">
                            <a href="#" className="text-decoration-none">Esqueceu a senha?</a>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login;