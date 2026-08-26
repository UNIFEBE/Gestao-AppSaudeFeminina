import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Phone, MapPin } from 'lucide-react'

import './cadastro.css'

export default function Cadastro() {
  const navigate = useNavigate()

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [telefone, setTelefone] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')

  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleCadastro() {
    setErro('')
    setSucesso('')

    if (!nome || !email || !senha) {
      setErro('Nome, email e senha são obrigatórios.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('https://localhost:7252/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          email,
          senha,
          telefone: telefone || null,
          cidade: cidade || null,
          estado: estado || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setErro(data.message || 'Erro ao criar conta.')
        return
      }

      setSucesso('Conta criada com sucesso!')
      setTimeout(() => navigate('/login'), 1500)
    } catch {
      setErro('Erro ao conectar com o servidor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="cadastro-container">
      <div className="cadastro-card">
        {/* HEADER */}
        <div className="cadastro-header">
          <h1>Criar Conta</h1>
          <p>Preencha seus dados para se cadastrar</p>
        </div>

        {/* FORM */}
        <div className="cadastro-form">
          <div className="input-group">
            <User size={18} />
            <input
              type="text"
              placeholder="Nome *"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="input-group">
            <Mail size={18} />
            <input
              type="email"
              placeholder="Email *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <Lock size={18} />
            <input
              type="password"
              placeholder="Senha *"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <div className="input-group">
            <Phone size={18} />
            <input
              type="text"
              placeholder="Telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </div>

          <div className="input-group">
            <MapPin size={18} />
            <input
              type="text"
              placeholder="Cidade"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
            />
          </div>

          <div className="input-group">
            <MapPin size={18} />
            <input
              type="text"
              placeholder="Estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            />
          </div>

          {erro && <span className="cadastro-erro">{erro}</span>}
          {sucesso && <span className="cadastro-sucesso">{sucesso}</span>}

          <button onClick={handleCadastro} disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>

          <a onClick={() => navigate('/login')}>
            Já tem conta? Entrar
          </a>
        </div>
      </div>
    </div>
  )
}
