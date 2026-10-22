import { useEffect, useRef, useState } from 'react'
import Masterpage from '../../../layouts/masterpage/masterpage'
import Editor from './Editor'

import './espacosaber.css'

const API_URL = '/api/artigos'

type Categoria = {
  id: string
  nome: string
  icone: string | null
}

type Artigo = {
  id: string
  categoriaId: string
  categoriaNome: string
  titulo: string
  resumo: string
  conteudo: string | null
  publicado: boolean
  createdAt: string
}

export default function EspacoSaber() {
  const [artigos, setArtigos] = useState<Artigo[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)

  // Form state
  const [titulo, setTitulo] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [resumo, setResumo] = useState('')
  const [conteudo, setConteudo] = useState('')
  const [publicado, setPublicado] = useState(true)

  // Ref para pegar valor do editor sem re-render
  const conteudoRef = useRef('')
  const [editorKey, setEditorKey] = useState(0)

  // Edit mode
  const [editingId, setEditingId] = useState<string | null>(null)

  const [erro, setErro] = useState('')
  const [filtroAtivos, setFiltroAtivos] = useState(true)

  const artigosFiltrados = filtroAtivos
    ? artigos.filter((a) => a.publicado)
    : artigos

  useEffect(() => {
    fetchCategorias()
    fetchArtigos()
  }, [])

  async function fetchCategorias() {
    try {
      const res = await fetch(`${API_URL}/categorias`)
      const data = await res.json()
      setCategorias(data)
    } catch {
      // silently fail
    }
  }

  async function fetchArtigos() {
    try {
      const res = await fetch(API_URL)
      const data = await res.json()
      setArtigos(data)
    } catch {
      setErro('Erro ao carregar artigos.')
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setTitulo('')
    setCategoriaId('')
    setResumo('')
    setConteudo('')
    setPublicado(true)
    setEditingId(null)
    setErro('')
    conteudoRef.current = ''
    setEditorKey((k) => k + 1)
  }

  function handleEditorChange(html: string) {
    conteudoRef.current = html
  }

  async function handleSave() {
    setErro('')

    if (!titulo || !categoriaId || !resumo) {
      setErro('Título, categoria e resumo são obrigatórios.')
      return
    }

    const body = {
      categoriaId,
      titulo,
      resumo,
      conteudo: conteudoRef.current || null,
      publicado,
    }

    try {
      let res: Response

      if (editingId) {
        res = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      } else {
        res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      }

      if (!res.ok) {
        const data = await res.json()
        setErro(data.message || 'Erro ao salvar artigo.')
        return
      }

      resetForm()
      fetchArtigos()
    } catch {
      setErro('Erro ao conectar com o servidor.')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Deseja excluir este artigo?')) return

    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      fetchArtigos()
    } catch {
      setErro('Erro ao excluir artigo.')
    }
  }

  function handleEdit(artigo: Artigo) {
    setTitulo(artigo.titulo)
    setCategoriaId(artigo.categoriaId)
    setResumo(artigo.resumo)
    setConteudo(artigo.conteudo || '')
    setPublicado(artigo.publicado)
    setEditingId(artigo.id)
    setErro('')
    conteudoRef.current = artigo.conteudo || ''
    setEditorKey((k) => k + 1)
  }

  return (
    <Masterpage>
      <div className="content-page">

        {/* HEADER */}
        <div className="content-header">
          <h1>Espaço Saber</h1>
        </div>

        <div className="content-grid">

          {/* FORM */}
          <div className="form-card">
            <h2>{editingId ? 'Editar Artigo' : 'Criar Artigo'}</h2>

            <input
              placeholder="Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />

            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
            >
              <option value="">Selecione a categoria</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nome}
                </option>
              ))}
            </select>

            <textarea
              placeholder="Resumo"
              value={resumo}
              onChange={(e) => setResumo(e.target.value)}
            />

            <div className="editor-wrapper">
              <label>Conteúdo</label>
              <Editor key={editorKey} content={conteudo} onChange={handleEditorChange} />
            </div>

            <select
              value={publicado ? 'ativo' : 'inativo'}
              onChange={(e) => setPublicado(e.target.value === 'ativo')}
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>

            {erro && <p className="form-erro">{erro}</p>}

            <button className="save-btn" onClick={handleSave}>
              {editingId ? 'Atualizar' : 'Salvar'}
            </button>

            {editingId && (
              <button className="cancel-btn" onClick={resetForm}>
                Cancelar
              </button>
            )}
          </div>

          {/* LISTA */}
          <div className="list-card">
            <div className="list-header">
              <h2>Artigos</h2>
              <div className="filtro-status">
                <button
                  className={`filtro-btn ${filtroAtivos ? 'ativo' : ''}`}
                  onClick={() => setFiltroAtivos(true)}
                >
                  Ativos
                </button>
                <button
                  className={`filtro-btn ${!filtroAtivos ? 'ativo' : ''}`}
                  onClick={() => setFiltroAtivos(false)}
                >
                  Todos
                </button>
              </div>
            </div>

            {loading && <p>Carregando...</p>}

            {!loading && artigosFiltrados.length === 0 && (
              <p className="empty-msg">
                {filtroAtivos ? 'Nenhum artigo ativo.' : 'Nenhum artigo cadastrado.'}
              </p>
            )}

            {artigosFiltrados.map((item) => (
              <div
                className={`content-item ${!item.publicado ? 'inativo' : ''}`}
                key={item.id}
              >
                <div>
                  <div className="item-titulo-row">
                    <strong>{item.titulo}</strong>
                    {!item.publicado && (
                      <span className="badge-inativo">Inativo</span>
                    )}
                  </div>
                  <span>{item.categoriaNome}</span>
                  <p>{item.resumo}</p>
                </div>

                <div className="actions">
                  <button onClick={() => handleEdit(item)}>
                    Editar
                  </button>

                  <button onClick={() => handleDelete(item.id)}>
                    Excluir
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
