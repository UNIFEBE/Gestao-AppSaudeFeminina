// import type { ReactNode } from 'react'
// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'


// import {
//   LayoutDashboard,
//   Users,
//   CalendarDays,
//   Settings,
//   Bell
// } from 'lucide-react'

// import { Link } from 'react-router-dom'

// import './styles.css'

// interface MasterpageProps {
//   children: ReactNode
// }

// export default function Masterpage({
//   children
// }: MasterpageProps) {

//   const [open, setOpen] = useState(false)
//   const navigate = useNavigate()

//   // 👇 função de logout (PASSO 2)
//   function handleLogout() {
//     localStorage.removeItem('auth')
//     navigate('/login')
//   }

//   return (
//     <div className="app-container">
//       <header className="navbar">
//         <div className="logo">
//           <h2>FemCare</h2>
//         </div>

//         <nav>
//           <Link to="/">
//             <LayoutDashboard size={18} />
//             Dashboard
//           </Link>

//           {/* <Link to="/usuarios">
//             <Users size={18} />
//             Usuárias
//           </Link> */}

//           <Link to="/consultas">
//             <CalendarDays size={18} />
//             Consultas
//           </Link>

//           <Link to="/configuracoes">
//             <Settings size={18} />
//             Configurações
//           </Link>
//         </nav>

//         <div className="navbar-actions">
//           <Bell size={20} />

//           <img
//             src="https://i.pravatar.cc/100"
//             alt="Admin"
//           />
//         </div>
//       </header>

//       <main className="page-content">
//         {children}
//       </main>
//     </div>
//   )
// }


import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Settings,
  Bell
} from 'lucide-react'

import { Link } from 'react-router-dom'

import './styles.css'

export default function Masterpage({ children }: any) {

  // 👇 AQUI (logo no início do componente)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  // 👇 função de logout (PASSO 2)
  function handleLogout() {
    localStorage.removeItem('auth')
    navigate('/login')
  }

  return (
    <div className="app-container">
      <header className="navbar">

        <div className="logo">
          <h2>FemCare</h2>
        </div>

        <nav>
          <Link to="/espaco-saber">Espaço saber</Link>
          {/* <Link to="/usuarios">Usuárias</Link> */}
          <Link to="/consultas">Consultas</Link>
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
          <strong>Admin</strong>
          <span>Administrador</span>
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