import { useParams } from 'react-router-dom'

import Masterpage from '../../../layouts/masterpage/masterpage'

import './styles.css'

export default function PatientDetails() {
  const { id } = useParams()

  const patient = {
    id,
    nomeCompleto: 'Maria Clara Oliveira',
    email: 'maria@email.com',
    dataNascimento: '12/08/1995',
    telefone: '(11) 99999-9999',
    altura: '1.68m',
    peso: '62kg',
    duracaoCiclo: '28 dias',
    menstrualFlow: 'Moderado',
    ultimoPeriodo: '02/05/2025',
    cicloRegular: 'Sim',
    contraceptivo: 'Não',
    desejaEngravidar: 'Talvez',
    motivo: 'Monitorar ciclo'

  }

  return (
    <Masterpage>
      <section className="details-header">
        <div>
          <h1>Paciente</h1>
          <p>
            Informações clínicas e saúde menstrual
          </p>
        </div>
      </section>

      <section className="details-card">
        {/* PERSONAL */}

        <div className="section-title">
          <h2>Informações Pessoais</h2>
        </div>

        <div className="details-grid">
          <div className="field">
            <label>Nome completo</label>
            <input value={patient.nomeCompleto} readOnly />
          </div>

          <div className="field">
            <label>Email</label>
            <input value={patient.email} readOnly />
          </div>

          <div className="field">
            <label>Data de nascimento</label>
            <input value={patient.dataNascimento} readOnly />
          </div>

          <div className="field">
            <label>Telefone</label>
            <input value={patient.telefone} readOnly />
          </div>

          <div className="field">
            <label>Altura</label>
            <input value={patient.altura} readOnly />
          </div>

          <div className="field">
            <label>Peso</label>
            <input value={patient.peso} readOnly />
          </div>
        </div>

        {/* MENSTRUAL */}

        <div className="section-title margin-top">
          <h2>Saúde Menstrual</h2>
        </div>

        <div className="details-grid">
          <div className="field">
            <label>Duração do ciclo</label>
            <input
              value={patient.duracaoCiclo}
              readOnly
            />
          </div>

          <div className="field">
            <label>Fluxo menstrual</label>
            <input
              value={patient.menstrualFlow}
              readOnly
            />
          </div>

          <div className="field">
            <label>Última menstruação</label>
            <input value={patient.ultimoPeriodo} readOnly />
          </div>

          <div className="field">
            <label>Ciclo regular?</label>
            <input
              value={patient.cicloRegular}
              readOnly
            />
          </div>

          <div className="field">
            <label>Usa anticoncepcional?</label>
            <input
              value={patient.contraceptivo}
              readOnly
            />
          </div>

          <div className="field">
            <label>Deseja engravidar?</label>
            <input
              value={patient.desejaEngravidar}
              readOnly
            />
          </div>

          <div className="field">
            <label>Objetivo</label>
            <input
              value={patient.motivo}
              readOnly
            />
        </div>
        </div>
      </section>
    </Masterpage>
  )
}