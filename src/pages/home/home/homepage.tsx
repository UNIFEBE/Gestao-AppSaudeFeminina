import Masterpage from '../../../layouts/masterpage/masterpage'
import { useNavigate } from 'react-router-dom'

import {
  Search,
  Users,
  CalendarDays,
  AlertTriangle,
  HeartPulse
} from 'lucide-react'

import './styles.css'

const patients = [
  {
    id: 1,
    name: 'Maria Clara',
    age: 29,
    condition: 'SOP',
    lastVisit: '12/04/2025',
    risk: 'Médio',
    status: 'Ativa'
  },
  {
    id:2,
    name: 'Fernanda Lima',
    age: 35,
    condition: 'Gestante',
    lastVisit: '02/05/2025',
    risk: 'Baixo',
    status: 'Ativa'
  },
  {
    id:3,
    name: 'Ana Souza',
    age: 31,
    condition: 'Endometriose',
    lastVisit: '18/03/2025',
    risk: 'Alto',
    status: 'Acompanhamento'
  }
]

export default function Home() {
  
  const navigate = useNavigate()
  return (
    <Masterpage>
      <section className="home-header">
        <div>
          <h1>Painel Clínico</h1>
          <p>
            Gestão inteligente da saúde da mulher
          </p>
        </div>
      </section>

      {/* SEARCH */}

      <section className="search-section">
        <div className="search-box">
          <Search size={20} />

          <input
            type="text"
            placeholder="Buscar paciente, condição, exame ou sintoma..."
          />
        </div>
      </section>

      {/* FILTERS */}

      <section className="filters">
        <button>Gestantes</button>
        <button>SOP</button>
        <button>Endometriose</button>
        <button>Menopausa</button>
        <button>Exames Pendentes</button>
        <button>Alto Risco</button>
      </section>

      {/* STATS */}

      <section className="stats-grid">
        <div className="stat-card">
          <Users size={28} />

          <div>
            <span>Pacientes Ativas</span>
            <strong>1.248</strong>
          </div>
        </div>

        <div className="stat-card">
          <CalendarDays size={28} />

          <div>
            <span>Consultas Hoje</span>
            <strong>24</strong>
          </div>
        </div>

        <div className="stat-card">
          <HeartPulse size={28} />

          <div>
            <span>Gestantes</span>
            <strong>82</strong>
          </div>
        </div>

        <div className="stat-card alert">
          <AlertTriangle size={28} />

          <div>
            <span>Alertas Clínicos</span>
            <strong>12</strong>
          </div>
        </div>
      </section>

      {/* ALERTS */}

      <section className="alerts-section">
        <h2>Alertas Prioritários</h2>

        <div className="alerts-list">
          <div className="alert-item">
            ⚠️ Maria Clara está há 14 meses sem consulta
          </div>

          <div className="alert-item">
            ⚠️ Fernanda possui exame pendente
          </div>

          <div className="alert-item">
            ⚠️ 3 pacientes com sintomas recorrentes
          </div>
        </div>
      </section>

      {/* TABLE */}

      <section className="table-section">
        <div className="table-header">
          <h2>Pacientes</h2>

          <button>Nova Paciente</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Idade</th>
              <th>Condição</th>
              <th>Última consulta</th>
              <th>Risco</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {patients.map((patient) => (
              // <tr key={patient.name}>
              <tr
                key={patient.id}
                className="table-row"
                onClick={() => navigate(`/paciente/${patient.id}`)}
              >
                <td>{patient.name}</td>
                <td>{patient.age}</td>
                <td>
                  <span className="condition">
                    {patient.condition}
                  </span>
                </td>
                <td>{patient.lastVisit}</td>
                <td>{patient.risk}</td>
                <td>
                  <span className="status">
                    {patient.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </Masterpage>
  )
}