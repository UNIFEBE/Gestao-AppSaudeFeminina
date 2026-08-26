import { useNavigate } from 'react-router-dom'

import { Lock, User } from 'lucide-react'

import './login.css'

export default function Login() {
  const navigate = useNavigate()

  function handleLogin() {
    localStorage.setItem('auth', 'true')

    navigate('/')
  }

  return (
    <div className="login-container">
      <div className="login-card">
        {/* HEADER */}

        <div className="login-header">
          <h1>FemCare</h1>

          <p>
            Plataforma inteligente para gestão da
            saúde da mulher
          </p>
        </div>

        {/* FORM */}

        <div className="login-form">
          <div className="input-group">
            <User size={18} />

            <input
              type="text"
              placeholder="Usuário"
            />
          </div>

          <div className="input-group">
            <Lock size={18} />

            <input
              type="password"
              placeholder="Senha"
            />
          </div>

          <button onClick={handleLogin}>
            Entrar
          </button>

          <a onClick={() => navigate('/redefinir-senha')}>
            Redefinir senha
          </a>
        </div>
      </div>
    </div>
  )
}