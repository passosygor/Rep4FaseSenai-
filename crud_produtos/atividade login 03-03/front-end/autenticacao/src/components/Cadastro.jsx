import React, { useState } from 'react';
import { cadastroApi } from '../services/usuario';

const Cadastro = () => {

    const [form, setForm] = useState({
        nome: '',
        email: '',
        senha: '',
		tipo_usuario: 1
    });

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await cadastroApi(form);
			console.log("Usuário cadastrado com sucesso:", response);
		} catch (error) {
			console.error(error);
		}
	}


  	return (
    <>
        <div className="container py-5">  
			<div className="row justify-content-center">  
				<div className="col-12 col-md-8 col-lg-6">  
				<div className="card shadow-sm">  
					<div className="card-body p-4">  
					<h3 className="card-title text-center mb-4">Cadastro de Usuário</h3>  
		
					<form onSubmit={handleSubmit}>  
						<div className="mb-3">  
						<label htmlFor="nome" className="form-label">  
							Nome  
						</label>  
						<input  
							id="nome"  
							type="text"  
							className="form-control"  
							placeholder="Seu nome completo"  
							value={form.nome}  
							onChange={(e) => setForm({ ...form, nome: e.target.value })}  
							required  
						/>  
						</div>  
		
						<div className="mb-3">  
						<label htmlFor="email" className="form-label">  
							E-mail  
						</label>  
						<input  
							id="email"  
							type="email"  
							className="form-control"  
							placeholder="nome@exemplo.com"  
							value={form.email}  
							onChange={(e) => setForm({ ...form, email: e.target.value })}  
							required  
						/>  
						</div>  
		
						<div className="mb-3">  
						<label htmlFor="senha" className="form-label">  
							Senha  
						</label>  
						<input  
							id="senha"  
							type="password"  
							className="form-control"  
							placeholder="********"  
							value={form.senha}  
							onChange={(e) => setForm({ ...form, senha: e.target.value })}  
							required  
							minLength={6}  
						/>  
						<div className="form-text">Mínimo de 6 caracteres.</div>  
						</div>  
		
						<div className="mb-4">  
						<label htmlFor="tipo_usuario" className="form-label">  
							Tipo de usuário  
						</label>  
						<select  
							id="tipo_usuario"  
							className="form-select"  
							value={form.tipo_usuario}  
							onChange={(e) =>  
							setForm({ ...form, tipo_usuario: Number(e.target.value) })  
							}  
							required  
						>  
							<option value={1}>Usuário normal</option>  
							<option value={2}>Administrador</option>  
						</select>  
						</div>  
		
						<button type="submit" className="btn btn-primary w-100">  Cadastrar  </button>  
		
					</form>  
					</div>  
				</div>  
		
				{/* opcional: dica visual */}  
				<div className="alert alert-info mt-3" role="alert">  
					Dica: selecione <strong>Administrador (2)</strong> apenas para contas  
					autorizadas.  
				</div>  
				</div>  
			</div>  
		</div>
    </>
  )
}

export default Cadastro