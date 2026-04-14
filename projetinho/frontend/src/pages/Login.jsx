import { useState } from 'react';

export default function Login() {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [isForgotMode, setIsForgotMode] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const url = isForgotMode ? 'http://localhost:3000/api/forgot-password' : 'http://localhost:3000/api/login';
    const body = isForgotMode ? { cpf, newPassword: password } : { cpf, password };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    if (res.ok) {
      alert(isForgotMode ? "Senha atualizada!" : "Login feito com sucesso!");
      if (!isForgotMode) {
        localStorage.setItem('user', JSON.stringify(data));
        window.location.href = '/dashboard'; // Redireciona
      }
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">{isForgotMode ? 'Redefinir Senha' : 'Login Clínica'}</h2>
        <input
          type="text"
          placeholder="CPF"
          className="w-full border p-2 mb-4 rounded"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder={isForgotMode ? 'Nova Senha' : 'Senha'}
          className="w-full border p-2 mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          {isForgotMode ? 'Atualizar Senha' : 'Entrar'}
        </button>
        <button
          type="button"
          onClick={() => setIsForgotMode(!isForgotMode)}
          className="w-full mt-4 text-sm text-blue-500 underline"
        >
          {isForgotMode ? 'Voltar ao Login' : 'Esqueci minha senha'}
        </button>
      </form>
    </div>
  );
}