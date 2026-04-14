import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  
  // Busca o usuário logado para mostrar o nome dele
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user'); // Limpa a sessão
    navigate('/'); // Manda de volta pra tela de Login
  };

  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md flex justify-between items-center">
      <div className="font-bold text-xl">
        🏥 Clínica SENAI
      </div>
      
      <div className="flex gap-6 items-center">
        {/* Menus exigidos no desafio */}
        <Link to="/dashboard" className="hover:text-blue-200 transition">
          Agendamentos
        </Link>
        <Link to="/usuarios" className="hover:text-blue-200 transition">
          Usuários
        </Link>
        
        {/* Área do Usuário e Botão de Sair */}
        <div className="flex items-center gap-4 border-l border-blue-400 pl-6 ml-2">
          <span className="text-sm">Olá, {user?.name || 'Usuário'}</span>
          <button 
            onClick={handleLogout} 
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition"
          >
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
}