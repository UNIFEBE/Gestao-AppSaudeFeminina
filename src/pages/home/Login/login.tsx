import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Mail, User } from 'lucide-react'

import { login, registrar, salvarSessao } from '../../../services/usuarioService'
import './login.css'

// ── tipos internos ────────────────────────────────────────────────────────────

type Modo = 'login' | 'cadastro'

// ── componente ────────────────────────────────────────────────────────────────

export default function Login() {
  const navigate = useNavigate()

  const [modo, setModo] = useState<Modo>('login')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState<string | null>(null)

  // campos login
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  // campos cadastro
  const [nome, setNome] = useState('')
  const [emailCad, setEmailCad] = useState('')
  const [senhaCad, setSenhaCad] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')

  function trocarModo(novoModo: Modo) {
    setModo(novoModo)
    setErro(null)
    setSucesso(null)
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)
    setLoading(true)

    try {
      const resposta = await login(email.trim(), senha)
      salvarSessao(resposta)
      navigate('/espaco-saber')
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao fazer login.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)
    setSucesso(null)

    if (senhaCad !== confirmarSenha) {
      setErro('As senhas não coincidem.')
      return
    }

    setLoading(true)

    try {
      await registrar({ nome: nome.trim(), email: emailCad.trim(), senha: senhaCad })
      setSucesso('Conta criada com sucesso! Faça login para continuar.')
      // limpa campos e volta para tela de login
      setNome('')
      setEmailCad('')
      setSenhaCad('')
      setConfirmarSenha('')
      setModo('login')
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao criar conta.')
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
          <p>Plataforma inteligente para gestão da saúde da mulher</p>
        </div>

        {/* TABS */}
        <div className="login-tabs">
          <button
            type="button"
            className={`login-tab ${modo === 'login' ? 'active' : ''}`}
            onClick={() => trocarModo('login')}
          >
            Entrar
          </button>
          <button
            type="button"
            className={`login-tab ${modo === 'cadastro' ? 'active' : ''}`}
            onClick={() => trocarModo('cadastro')}
          >
            Criar conta
          </button>
        </div>

        {/* FEEDBACK */}
        {erro && <p className="login-erro">{erro}</p>}
        {sucesso && <p className="login-sucesso">{sucesso}</p>}

        {/* ── FORMULÁRIO DE LOGIN ── */}
        {modo === 'login' && (
          <form className="login-form" onSubmit={handleLogin} noValidate>
            <div className="input-group">
              <Mail size={18} />
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="input-group">
              <Lock size={18} />
              <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
        )}

        {/* ── FORMULÁRIO DE CADASTRO ── */}
        {modo === 'cadastro' && (
          <form className="login-form" onSubmit={handleCadastro} noValidate>
            <div className="input-group">
              <User size={18} />
              <input
                type="text"
                placeholder="Nome completo"
                value={nome}
                onChange={e => setNome(e.target.value)}
                required
                autoComplete="name"
              />
            </div>

            <div className="input-group">
              <Mail size={18} />
              <input
                type="email"
                placeholder="E-mail"
                value={emailCad}
                onChange={e => setEmailCad(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="input-group">
              <Lock size={18} />
              <input
                type="password"
                placeholder="Senha"
                value={senhaCad}
                onChange={e => setSenhaCad(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            <div className="input-group">
              <Lock size={18} />
              <input
                type="password"
                placeholder="Confirmar senha"
                value={confirmarSenha}
                onChange={e => setConfirmarSenha(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Criando conta…' : 'Criar conta'}
            </button>
          </form>
        )}

      </div>
    </div>
  )
}
