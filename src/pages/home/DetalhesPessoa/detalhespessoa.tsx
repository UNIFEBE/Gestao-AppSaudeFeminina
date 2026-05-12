import { useParams } from 'react-router-dom'

import Masterpage from '../../../layouts/masterpage/masterpage'

import {
  CalendarDays,
  HeartPulse,
  FileText,
  AlertTriangle
} from 'lucide-react'

import './styles.css'

export default function PatientDetails() {
  const { id } = useParams()

  return (
    <Masterpage>
      <section className="patient-header">
        <div className="patient-profile">
          <img
            src={`https://i.pravatar.cc/150?u=${id}`}
            alt=""
          />

          <div>
            <h1>Maria Clara</h1>

            <p>29 anos • SOP • Paciente ativa</p>
          </div>
        </div>

        <button>Editar Paciente</button>
      </section>

      {/* CARDS */}

      <section className="patient-stats">
        <div className="info-card">
          <CalendarDays size={24} />

          <div>
            <span>Última consulta</span>
            <strong>12/04/2025</strong>
          </div>
        </div>

        <div className="info-card">
          <HeartPulse size={24} />

          <div>
            <span>Condição principal</span>
            <strong>SOP</strong>
          </div>
        </div>

        <div className="info-card">
          <AlertTriangle size={24} />

          <div>
            <span>Risco clínico</span>
            <strong>Médio</strong>
          </div>
        </div>
      </section>

      {/* GRID */}

      <section className="details-grid">
        {/* TIMELINE */}

        <div className="card">
          <h2>Timeline Clínica</h2>

          <div className="timeline">
            <div className="timeline-item">
              <span>12 Abr 2025</span>

              <p>Consulta ginecológica de rotina</p>
            </div>

            <div className="timeline-item">
              <span>02 Fev 2025</span>

              <p>Exame hormonal solicitado</p>
            </div>

            <div className="timeline-item">
              <span>18 Jan 2025</span>

              <p>Relato de irregularidade menstrual</p>
            </div>
          </div>
        </div>

        {/* EXAMS */}

        <div className="card">
          <h2>Exames Recentes</h2>

          <div className="exam-item">
            <FileText size={18} />

            <div>
              <strong>Ultrassom Pélvico</strong>
              <p>Resultado normal</p>
            </div>
          </div>

          <div className="exam-item">
            <FileText size={18} />

            <div>
              <strong>Hormonal Completo</strong>
              <p>Alterações leves</p>
            </div>
          </div>
        </div>

        {/* NOTES */}

        <div className="card full">
          <h2>Observações Clínicas</h2>

          <p>
            Paciente apresenta sintomas recorrentes
            relacionados à SOP. Recomendada manutenção
            do acompanhamento trimestral.
          </p>
        </div>
      </section>
    </Masterpage>
  )
}