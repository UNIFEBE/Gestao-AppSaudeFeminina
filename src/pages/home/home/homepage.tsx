import Masterpage from '../../../layouts/masterpage/masterpage'
import { useNavigate } from 'react-router-dom'

import {
  Search,
  Users,
  CalendarDays,
  AlertTriangle,
  Baby 
} from 'lucide-react'

import './styles.css'

const patients = [
  {
    id: 1,
    nome: 'Maria Clara',
    idade: 29,
    objetivo: 'Engravidar',
    ultimoPeriodo: '12/04/2025',
    ciclo: 'Regular'
  },
  {
    id:2,
    nome: 'Fernanda Lima',
    idade: 35,
    objetivo: 'Monitorar ciclo',
    ultimoPeriodo: '02/05/2025',
    ciclo: 'Irregular'
  },
  {
    id:3,
    nome: 'Ana Souza',
    idade: 31,
    objetivo: 'Acompanhar sintomas',
    ultimoPeriodo: '18/03/2025',
    ciclo: 'Regular'
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

      {/* PACIENTES ATIVAS (mantém) */}
      <div className="stat-card">
        <Users size={28} />
      
        <div>
          <span>Pacientes Ativas</span>
          <strong>1.248</strong>
        </div>
      </div>
      
      {/* TENTANDO ENGRAVIDAR (novo) */}
      <div className="stat-card">
        <Baby size={28} />
      
        <div>
          <span>Tentando Engravidar</span>
          <strong>86</strong>
        </div>
      </div>
      
      {/* CONSULTAS HOJE (mantém) */}
      <div className="stat-card">
        <CalendarDays size={28} />
      
        <div>
          <span>Consultas Hoje</span>
          <strong>24</strong>
        </div>
      </div>
      
      {/* ALERTAS CLÍNICOS (mantém) */}
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
        </div>

        <table>
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Idade</th>
              <th>Objetivo</th>
              <th>Última menstruação</th>
              <th>Ciclo</th>
              {/* <th>Status</th> */}
            </tr>
          </thead>

          <tbody>
             {patients.map((patient) => (
               <tr
                 key={patient.id}
                 className="table-row"
                 onClick={() =>
                   navigate(`/paciente/${patient.id}`)
                 }
               >
                 <td className="patient-cell">               
                  <span>{patient.nome}</span>
                 </td>
               
                 <td>{patient.idade} anos</td>
               
                 <td>
                   <span
                     className={`objective-badge ${
                       patient.objetivo === 'Engravidar'
                         ? 'pregnancy'
                         : patient.objetivo ===
                           'Monitorar ciclo'
                         ? 'monitor'
                         : 'symptoms'
                     }`}
                   >
                     {patient.objetivo}
                   </span>
                 </td>
                   
                 <td>{patient.ultimoPeriodo}</td>
                   
                 <td>
                   <span
                     className={`cycle-badge ${
                       patient.ciclo === 'Regular'
                         ? 'regular'
                         : 'irregular'
                     }`}
                   >
                     {patient.ciclo}
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