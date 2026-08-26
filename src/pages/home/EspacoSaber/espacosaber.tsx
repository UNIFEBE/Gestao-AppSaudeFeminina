import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import ReactQuill from 'react-quill-new'
import type Quill from 'quill'
import 'react-quill-new/dist/quill.snow.css'
import Masterpage from '../../../layouts/masterpage/masterpage'
import './espacosaber.css'

// ─── Constantes ───────────────────────────────────────────────────────────────

const API = 'http://localhost:5201/api'

const CATEGORIAS: { id: string; nome: string }[] = [
  { id: '37c69607-c817-46fe-acec-038a244432ed', nome: 'Menstruação'  },
  { id: '95e5999b-1cbb-41ef-95d7-1874ca4c796b', nome: 'Contracepção' },
  { id: 'e2f8b63f-c931-4665-9834-3454b8482f76', nome: 'Saúde Íntima' },
  { id: '9cb4e5ff-6d30-481d-97c2-be56815fc626', nome: 'Gravidez'     },
]

const MAX_IMAGEM_BYTES = 5 * 1024 * 1024   // 5 MB por imagem inline

// ─── Tipos ────────────────────────────────────────────────────────────────────

type ArtigoDto = {
  id: string
  categoriaId: string
  categoriaNome: string
  titulo: string
  resumo: string
  conteudo: string | null   // null na listagem; preenchido no GET /{id}
  publicado: boolean
  criadoEm: string
  atualizadoEm: string
  midias: ArtigoMidiaDto[]
}

type ArtigoMidiaDto = {
  id: string
  artigoId: string
  tipo: string
  mimeType: string
  nomeArquivo: string | null
  tamanhoBytes: number | null
  descricaoAlt: string | null
  ordem: number
}

type FormState = {
  categoriaId: string
  titulo: string
  resumo: string
  conteudo: string   // HTML — o Quill trabalha com HTML internamente
  publicado: boolean
}

const FORM_VAZIO: FormState = {
  categoriaId: '',
  titulo: '',
  resumo: '',
  conteudo: '',
  publicado: true,
}

// ─── Formato de blocos JSON (schema do banco) ─────────────────────────────────
//
//   { "type": "heading",    "level": 1|2|3, "text": "..." }
//   { "type": "paragraph",  "text": "Texto <b>com</b> HTML inline." }
//   { "type": "list",       "style": "bullet"|"ordered", "items": ["A","B"] }
//   { "type": "image",      "midiaId": "<uuid>", "alt": "..." }
//   { "type": "video",      "midiaId": "<uuid>", "descricao": "..." }
//   { "type": "blockquote", "text": "..." }
//   { "type": "code",       "text": "..." }

type BlocoHeading    = { type: 'heading';    level: 1|2|3; text: string }
type BlocoParagrafo  = { type: 'paragraph';  text: string }
type BlocoLista      = { type: 'list';       style: 'bullet'|'ordered'; items: string[] }
type BlocoImagem     = { type: 'image';      midiaId: string; alt: string }
type BlocoVideo      = { type: 'video';      midiaId: string; descricao: string }
type BlocoBlockquote = { type: 'blockquote'; text: string }
type BlocoCodigo     = { type: 'code';       text: string }
type Bloco = BlocoHeading | BlocoParagrafo | BlocoLista | BlocoImagem | BlocoVideo | BlocoBlockquote | BlocoCodigo

// ─── Conversão HTML ↔ Blocos JSON ─────────────────────────────────────────────

const API_MIDIA_RE = new RegExp(
  `^${API.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/artigos/[^/]+/midias/([^/]+)$`
)

/** Extrai midiaId de uma URL da API (https://…/artigos/{aid}/midias/{mid}) */
function midiaIdDaUrl(url: string): string | null {
  const m = url.match(API_MIDIA_RE)
  return m ? m[1] : null
}

/** URL de acesso a uma mídia já persistida no banco */
function midiaUrl(artigoId: string, midiaId: string): string {
  return `${API}/artigos/${artigoId}/midias/${midiaId}`
}

/**
 * Converte HTML do Quill → array de blocos JSON do banco.
 * Imagens com src blob: são ignoradas (ainda não foram salvas).
 * Imagens com src da API são convertidas para { type: 'image', midiaId }.
 */
function htmlParaBlocos(html: string): Bloco[] {
  const trimmed = html?.trim() ?? ''
  if (!trimmed || trimmed === '<p><br></p>') return []

  const doc = new DOMParser().parseFromString(trimmed, 'text/html')
  const blocos: Bloco[] = []

  function innerHtml(el: Element): string {
    return el.innerHTML.replace(/<br\s*\/?>/gi, '\n').trim()
  }

  function processar(el: Element): void {
    const tag = el.tagName?.toLowerCase() ?? ''

    if (tag === 'h1' || tag === 'h2' || tag === 'h3') {
      const level = parseInt(tag[1]) as 1|2|3
      const text  = innerHtml(el)
      if (text) blocos.push({ type: 'heading', level, text })
      return
    }

    if (tag === 'p') {
      const imgs = el.querySelectorAll('img')
      if (imgs.length === 1 && el.textContent?.trim() === '') {
        const src = (imgs[0] as HTMLImageElement).src
        const mid = midiaIdDaUrl(src)
        if (mid) {
          blocos.push({ type: 'image', midiaId: mid, alt: imgs[0].getAttribute('alt') ?? '' })
          return
        }
        // src blob: — imagem pendente não foi enviada; descarta silenciosamente
        if (src.startsWith('blob:')) return
      }
      const text = innerHtml(el)
      if (text && text !== '<br>') blocos.push({ type: 'paragraph', text })
      return
    }

    if (tag === 'ul' || tag === 'ol') {
      const style: 'bullet'|'ordered' = tag === 'ul' ? 'bullet' : 'ordered'
      const items = Array.from(el.querySelectorAll('li'))
        .map(li => innerHtml(li))
        .filter(t => !!t)
      if (items.length) blocos.push({ type: 'list', style, items })
      return
    }

    if (tag === 'blockquote') {
      const inner = el.querySelector('p')
      const text = inner ? innerHtml(inner) : innerHtml(el)
      if (text) blocos.push({ type: 'blockquote', text })
      return
    }

    if (tag === 'pre') {
      const text = el.textContent?.trim() ?? ''
      if (text) blocos.push({ type: 'code', text })
      return
    }

    if (tag === 'img') {
      const src = (el as HTMLImageElement).src
      const mid = midiaIdDaUrl(src)
      if (mid) blocos.push({ type: 'image', midiaId: mid, alt: el.getAttribute('alt') ?? '' })
      return
    }

    for (const child of Array.from(el.children)) processar(child)
  }

  for (const child of Array.from(doc.body.children)) processar(child)

  return blocos
}

/** Converte array de blocos JSON → HTML para o Quill renderizar */
function blocosParaHtml(blocos: Bloco[], artigoId: string): string {
  return blocos.map(bloco => {
    switch (bloco.type) {
      case 'heading':
        return `<h${bloco.level}>${bloco.text}</h${bloco.level}>`
      case 'paragraph':
        return `<p>${bloco.text}</p>`
      case 'list': {
        const tag   = bloco.style === 'ordered' ? 'ol' : 'ul'
        const itens = bloco.items.map(i => `<li>${i}</li>`).join('')
        return `<${tag}>${itens}</${tag}>`
      }
      case 'image':
        return `<p><img src="${midiaUrl(artigoId, bloco.midiaId)}" alt="${bloco.alt ?? ''}"></p>`
      case 'video':
        return `<p><a href="${midiaUrl(artigoId, bloco.midiaId)}">${bloco.descricao ?? 'Vídeo'}</a></p>`
      case 'blockquote':
        return `<blockquote><p>${bloco.text}</p></blockquote>`
      case 'code':
        return `<pre class="ql-syntax">${bloco.text}</pre>`
      default:
        return ''
    }
  }).join('')
}

/**
 * Normaliza conteúdo vindo da API:
 * - vazio / '[]' → '' (editor em branco)
 * - JSON de blocos → HTML
 * - HTML legado → retorna direto
 */
function normalizarConteudo(raw: string | null, artigoId: string): string {
  const trimmed = raw?.trim() ?? ''
  if (!trimmed || trimmed === '[]' || trimmed === '{}') return ''

  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      const blocos: Bloco[] = JSON.parse(trimmed)
      if (Array.isArray(blocos)) return blocosParaHtml(blocos, artigoId)
    } catch { /* HTML legado */ }
  }

  return trimmed
}

// ─── Helpers de API ───────────────────────────────────────────────────────────

async function uploadMidia(artigoId: string, file: File): Promise<ArtigoMidiaDto> {
  const fd = new FormData()
  fd.append('arquivo', file)
  fd.append('tipo', 'Imagem')
  fd.append('descricaoAlt', file.name)

  const res = await fetch(`${API}/artigos/${artigoId}/midias`, {
    method: 'POST',
    body: fd,
  })
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText)
    throw new Error(`Falha ao enviar imagem (${res.status}): ${msg}`)
  }
  return res.json()
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function ContentManager() {
  const [artigos, setArtigos] = useState<ArtigoDto[]>([])
  const [form, setForm] = useState<FormState>(FORM_VAZIO)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [filtroCat, setFiltroCat] = useState<string>('')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  // Imagens inseridas no editor mas ainda não enviadas ao servidor.
  // Chave: blobUrl temporária  |  Valor: File original
  const imagensPendentes = useRef<Map<string, File>>(new Map())

  // Ref do editor Quill
  const quillRef = useRef<ReactQuill | null>(null)

  // Ref "vivo" do form — permite handlers estáveis sem recriar módulos do Quill
  const formRef = useRef<FormState>(FORM_VAZIO)
  useEffect(() => { formRef.current = form }, [form])

  useEffect(() => {
    carregarArtigos()
  }, [])

  // ── Carregar ───────────────────────────────────────────────────────────────

  async function carregarArtigos(categoriaId?: string) {
    setCarregando(true)
    setErro(null)
    try {
      const url = categoriaId
        ? `${API}/artigos?categoriaId=${categoriaId}`
        : `${API}/artigos`
      const res = await fetch(url)
      if (!res.ok) throw new Error('Erro ao carregar artigos')
      setArtigos(await res.json())
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : 'Erro desconhecido')
    } finally {
      setCarregando(false)
    }
  }

  // ── Inserir imagem no editor (apenas local, sem chamada à API) ─────────────

  const handleImagemInline = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.click()

    input.onchange = () => {
      const file = input.files?.[0]
      if (!file) return

      if (file.size > MAX_IMAGEM_BYTES) {
        setErro(`A imagem "${file.name}" excede o limite de 5 MB.`)
        return
      }

      // Cria URL temporária e registra como pendente — nenhuma chamada à API aqui
      const blobUrl = URL.createObjectURL(file)
      imagensPendentes.current.set(blobUrl, file)

      const editor = quillRef.current?.getEditor() as Quill | undefined
      if (editor) {
        const range = editor.getSelection(true)
        editor.insertEmbed(range.index, 'image', blobUrl)
        editor.insertText(range.index + 1, '\n')
        editor.setSelection(range.index + 2, 0)
      }
    }
  }, [])

  const quillModules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        [{ color: [] }, { background: [] }],
        ['clean'],
      ],
      handlers: { image: handleImagemInline },
    },
  }), [handleImagemInline])

  // ── Formulário ─────────────────────────────────────────────────────────────

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: name === 'publicado' ? value === 'true' : value,
    }))
  }

  // ── Salvar ─────────────────────────────────────────────────────────────────
  //
  // Sequência:
  //   1. Cria ou atualiza o artigo (sem imagens no conteudo ainda)
  //   2. Para cada imagem pendente (blob:) presente no HTML atual:
  //      a. POST /artigos/{id}/midias  →  obtém midiaId
  //      b. Substitui o blob: pela URL definitiva da API no HTML
  //   3. Se houve imagens, converte o HTML atualizado para JSON e faz PUT final

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault()
    if (!form.categoriaId || !form.titulo.trim() || !form.resumo.trim()) {
      setErro('Preencha Categoria, Título e Resumo.')
      return
    }

    setCarregando(true)
    setErro(null)
    try {
      // ── 1. Persiste o artigo (conteudo sem as imagens blob: ainda) ──────────
      const conteudoInicial = JSON.stringify(htmlParaBlocos(form.conteudo))

      const payload = {
        categoriaId: form.categoriaId,
        titulo: form.titulo.trim(),
        resumo: form.resumo.trim(),
        conteudo: conteudoInicial,
        publicado: form.publicado,
      }

      let artigoId = editandoId

      if (artigoId) {
        const res = await fetch(`${API}/artigos/${artigoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error(`Falha ao atualizar artigo (${res.status})`)
      } else {
        const res = await fetch(`${API}/artigos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error(`Falha ao criar artigo (${res.status})`)
        const criado: ArtigoDto = await res.json()
        artigoId = criado.id
      }

      // ── 2. Faz upload das imagens pendentes e substitui blob: → URL da API ──
      const pendentes = imagensPendentes.current
      const blobsNoConteudo = [...pendentes.keys()].filter(b =>
        form.conteudo.includes(b)
      )

      if (blobsNoConteudo.length > 0) {
        let htmlAtualizado = form.conteudo

        for (const blobUrl of blobsNoConteudo) {
          const file = pendentes.get(blobUrl)!
          const midia = await uploadMidia(artigoId, file)
          const urlDefinitiva = midiaUrl(artigoId, midia.id)
          htmlAtualizado = htmlAtualizado.split(blobUrl).join(urlDefinitiva)
          URL.revokeObjectURL(blobUrl)
          pendentes.delete(blobUrl)
        }

        // ── 3. Salva o conteudo final (com URLs definitivas) ─────────────────
        const conteudoFinal = JSON.stringify(htmlParaBlocos(htmlAtualizado))
        const res = await fetch(`${API}/artigos/${artigoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, conteudo: conteudoFinal }),
        })
        if (!res.ok) throw new Error(`Falha ao salvar conteúdo final (${res.status})`)
      }

      handleNovo()
      await carregarArtigos(filtroCat || undefined)
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : 'Erro desconhecido')
    } finally {
      setCarregando(false)
    }
  }

  // ── Editar ─────────────────────────────────────────────────────────────────

  async function handleEditar(artigo: ArtigoDto) {
    // Libera blobs pendentes do artigo anterior antes de trocar
    for (const blobUrl of imagensPendentes.current.keys()) {
      URL.revokeObjectURL(blobUrl)
    }
    imagensPendentes.current.clear()

    setEditandoId(artigo.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })

    // A listagem retorna conteudo: null — busca o artigo completo
    try {
      const res = await fetch(`${API}/artigos/${artigo.id}`)
      const completo: ArtigoDto = res.ok ? await res.json() : artigo
      setForm({
        categoriaId: completo.categoriaId,
        titulo: completo.titulo,
        resumo: completo.resumo,
        conteudo: normalizarConteudo(completo.conteudo, completo.id),
        publicado: completo.publicado,
      })
    } catch {
      setForm({
        categoriaId: artigo.categoriaId,
        titulo: artigo.titulo,
        resumo: artigo.resumo,
        conteudo: normalizarConteudo(artigo.conteudo, artigo.id),
        publicado: artigo.publicado,
      })
    }
  }

  function handleNovo() {
    // Libera URLs temporárias que não foram salvas
    for (const blobUrl of imagensPendentes.current.keys()) {
      URL.revokeObjectURL(blobUrl)
    }
    imagensPendentes.current.clear()

    setForm(FORM_VAZIO)
    setEditandoId(null)
    setErro(null)
  }

  // ── Toggle publicado ───────────────────────────────────────────────────────

  async function handleTogglePublicado(artigo: ArtigoDto) {
    try {
      const res = await fetch(`${API}/artigos/${artigo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoriaId: artigo.categoriaId,
          titulo: artigo.titulo,
          resumo: artigo.resumo,
          conteudo: artigo.conteudo ?? '[]',
          publicado: !artigo.publicado,
        }),
      })
      if (!res.ok) throw new Error()
      await carregarArtigos(filtroCat || undefined)
    } catch {
      setErro('Erro ao alterar status do artigo')
    }
  }

  async function handleFiltro(catId: string) {
    setFiltroCat(catId)
    await carregarArtigos(catId || undefined)
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  const artigosVisiveis = filtroCat
    ? artigos.filter(a => a.categoriaId === filtroCat)
    : artigos

  return (
    <Masterpage>
      <div className="content-page">

        <div className="content-header">
          <h1>Gerenciar Conteúdo</h1>
        </div>

        {erro && <div className="alert-erro">{erro}</div>}

        <div className="content-grid">

          {/* ── FORMULÁRIO ── */}
          <div className="form-card">
            <h2>{editandoId ? 'Editar Artigo' : 'Criar Conteúdo'}</h2>

            <form onSubmit={handleSalvar}>

              <input
                name="titulo"
                placeholder="Título"
                value={form.titulo}
                onChange={handleChange}
                required
              />

              <select
                name="categoriaId"
                value={form.categoriaId}
                onChange={handleChange}
                required
              >
                <option value="">Categoria</option>
                {CATEGORIAS.map(c => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>

              <textarea
                name="resumo"
                placeholder="Descrição"
                value={form.resumo}
                onChange={handleChange}
                required
              />

              {/* ── EDITOR RICH TEXT ── */}
              <div className="editor-wrapper">
                <label className="editor-label">Conteúdo completo</label>
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={form.conteudo}
                  onChange={value => setForm(prev => ({ ...prev, conteudo: value }))}
                  placeholder="Escreva o conteúdo completo do artigo..."
                  modules={quillModules}
                />
              </div>

              <select
                name="publicado"
                value={String(form.publicado)}
                onChange={handleChange}
              >
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </select>

              <div className="form-actions">
                {editandoId && (
                  <button type="button" className="cancel-btn" onClick={handleNovo}>
                    Cancelar
                  </button>
                )}
                <button
                  type="submit"
                  className="save-btn"
                  disabled={carregando}
                >
                  {carregando ? 'Salvando...' : editandoId ? 'Atualizar' : 'Salvar'}
                </button>
              </div>

            </form>
          </div>

          {/* ── LISTA ── */}
          <div className="list-card">
            <div className="list-header">
              <h2>Conteúdos</h2>
              <select
                className="filtro-select"
                value={filtroCat}
                onChange={e => handleFiltro(e.target.value)}
              >
                <option value="">Todas as categorias</option>
                {CATEGORIAS.map(c => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>

            {carregando && <p className="loading-text">Carregando...</p>}

            {!carregando && artigosVisiveis.length === 0 && (
              <p className="empty-text">Nenhum artigo encontrado.</p>
            )}

            {artigosVisiveis.map(artigo => (
              <div
                key={artigo.id}
                className={`content-item ${!artigo.publicado ? 'item-inativo' : ''}`}
              >
                <div className="item-texto">
                  <strong>{artigo.titulo}</strong>
                  <span>{artigo.categoriaNome}</span>
                  <p>{artigo.resumo}</p>
                  {artigo.midias.length > 0 && (
                    <small className="item-midias-info">
                      {artigo.midias.length} mídia{artigo.midias.length > 1 ? 's' : ''}
                    </small>
                  )}
                </div>

                <div className="actions">
                  <button onClick={() => handleEditar(artigo)}>Editar</button>
                  <button onClick={() => handleTogglePublicado(artigo)}>
                    {artigo.publicado ? 'Desativar' : 'Ativar'}
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
