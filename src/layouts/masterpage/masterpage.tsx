import type { ReactNode } from 'react'

import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Settings,
  Bell
} from 'lucide-react'

import { Link } from 'react-router-dom'

import './styles.css'

interface MasterpageProps {
  children: ReactNode
}

export default function Masterpage({
  children
}: MasterpageProps) {
  return (
    <div className="app-container">
      <header className="navbar">
        <div className="logo">
          <h2>FemCare</h2>
        </div>

        <nav>
          <Link to="/">
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link to="/usuarios">
            <Users size={18} />
            Usuárias
          </Link>

          <Link to="/consultas">
            <CalendarDays size={18} />
            Consultas
          </Link>

          <Link to="/configuracoes">
            <Settings size={18} />
            Configurações
          </Link>
        </nav>

        <div className="navbar-actions">
          <Bell size={20} />

          <img
            src="https://i.pravatar.cc/100"
            alt="Admin"
          />
        </div>
      </header>

      <main className="page-content">
        {children}
      </main>
    </div>
  )
}