import { useState } from 'react'
import Masterpage from '../../../layouts/masterpage/masterpage'

import './espacosaber.css'

type Content = {
  id: number
  title: string
  category: string
  description: string
  active: boolean
}

export default function ContentManager() {
  const [contents, setContents] = useState<Content[]>([
    {
      id: 1,
      title: 'PH Vaginal e Higiene',
      category: 'Saúde Íntima',
      description: 'Saiba como manter o equilíbrio...',
      active: true
    },
    {
      id: 2,
      title: 'Contracepção Segura',
      category: 'Prevenção',
      description: 'Métodos contraceptivos modernos...',
      active: true
    }
  ])

  return (
    <Masterpage>
      <div className="content-page">

        {/* HEADER */}
        <div className="content-header">
          <h1>Gerenciar Conteúdo</h1>

          <button className="new-btn">
            + Nova Mensagem
          </button>
        </div>

        <div className="content-grid">

          {/* FORM */}
          <div className="form-card">
            <h2>Criar Conteúdo</h2>

            <input placeholder="Título" />
            <input placeholder="Categoria" />
            <textarea placeholder="Descrição" />
            <textarea placeholder="Conteúdo completo" />

            <select>
              <option>Ativo</option>
              <option>Inativo</option>
            </select>

            <button className="save-btn">
              Salvar
            </button>
          </div>

          {/* LISTA */}
          <div className="list-card">
            <h2>Conteúdos Ativos</h2>

            {contents.map((item) => (
              <div className="content-item" key={item.id}>
                <div>
                  <strong>{item.title}</strong>

                  <span>{item.category}</span>

                  <p>{item.description}</p>
                </div>

                <div className="actions">
                  <button>Editar</button>

                  <button>
                    {item.active ? 'Desativar' : 'Ativar'}
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </Masterpage>
  )
}