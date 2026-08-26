import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Mail } from 'lucide-react'

import './login.css'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setErro('')

    if (!email || !senha) {
      setErro('Preencha todos os campos.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('https://localhost:7252/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      })

      if (!response.ok) {
        const data = await response.json()
        setErro(data.message || 'Email ou senha inválidos.')
        return
      }

      const data = await response.json()

      localStorage.setItem('auth', 'true')
      localStorage.setItem('userId', data.id)
      localStorage.setItem('userName', data.nome)

      navigate('/espaco-saber')
    } catch {
      setErro('Erro ao conectar com o servidor.')
    } finally {
      setLoading(false)
    }
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
            <Mail size={18} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <Lock size={18} />
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>

          {erro && <span className="login-erro">{erro}</span>}

          <button onClick={handleLogin} disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <a onClick={() => navigate('/cadastro')}>
            Criar conta
          </a>
        </div>
      </div>
    </div>
  )
}
