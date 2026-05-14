import { useNavigate } from 'react-router-dom'

import { Lock } from 'lucide-react'

import './redefinirsenha.css'

export default function ResetPassword() {
  const navigate = useNavigate()

  function handleEnterSystem() {
    localStorage.setItem('auth', 'true')

    navigate('/')
  }

  return (
    <div className="reset-container">
      <div className="reset-card">
        {/* HEADER */}

        <div className="reset-header">
          <h1>Redefinir Senha</h1>

          <p>
            Crie uma nova senha para acessar o
            sistema
          </p>
        </div>

        {/* INPUT */}

        <div className="input-group">
          <Lock size={18} />

          <input
            type="password"
            placeholder="Nova senha"
          />
        </div>

        {/* ACTIONS */}

        <div className="actions">
          <button
            className="secondary-btn"
            onClick={() => navigate('/login')}
          >
            Voltar ao login
          </button>

          <button
            className="primary-btn"
            onClick={handleEnterSystem}
          >
            Entrar no sistema
          </button>
        </div>
      </div>
    </div>
  )
}