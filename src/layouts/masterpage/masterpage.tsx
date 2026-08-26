import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { LayoutDashboard } from 'lucide-react'

import { Link } from 'react-router-dom'

import { limparSessao, getUsuario } from '../../services/usuarioService'

import './styles.css'

export default function Masterpage({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const usuario = getUsuario()

  function handleLogout() {
    limparSessao()
    navigate('/login')
  }

  return (
    <div className="app-container">
      <header className="navbar">

        <div className="logo">
          <h2>FemCare</h2>
        </div>

        <nav>
          <Link to="/espaco-saber">Espaço Saber</Link>
        </nav>

        {/* PERFIL */}
        <div className="profile">
          <button
            className="avatar-button"
            onClick={() => setOpen(!open)}
          >
            <img
              src="https://i.pravatar.cc/100"
              alt="perfil"
            />
            <span className="status-dot" />
          </button>

          {open && (
            <div className="dropdown">
              <div className="dropdown-header">
                <img src="https://i.pravatar.cc/100" alt="" />
                <div>
                  <strong>{usuario?.nome ?? 'Usuário'}</strong>
                  <span>{usuario?.email ?? ''}</span>
                </div>
              </div>

              <div className="dropdown-divider" />

              <button onClick={handleLogout} className="logout-btn">
                Sair do sistema
              </button>
            </div>
          )}
        </div>

      </header>

      <main className="page-content">
        {children}
      </main>
    </div>
  )
}