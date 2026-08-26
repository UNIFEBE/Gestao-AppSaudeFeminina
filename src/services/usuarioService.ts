import { post } from './api'

// ── Tipos espelhando os DTOs da API ──────────────────────────────────────────

export interface UsuarioDto {
  id: string
  nome: string
  email: string
  dataNascimento: string | null
  telefone: string | null
  cidade: string | null
  estado: string | null
  peso: number | null
  altura: number | null
  tipoSanguineo: string | null
  faseVida: string | null
  criadoEm: string
  atualizadoEm: string
}

export interface LoginResponse {
  token: string
  expiracao: string
  usuario: UsuarioDto
}

export interface RegistrarPayload {
  nome: string
  email: string
  senha: string
}

// ── Funções ──────────────────────────────────────────────────────────────────

export function login(email: string, senha: string) {
  return post<LoginResponse>('/api/usuarios/login', { email, senha })
}

export function registrar(payload: RegistrarPayload) {
  return post<UsuarioDto>('/api/usuarios/registrar', payload)
}

// ── Helpers de sessão ─────────────────────────────────────────────────────────

export function salvarSessao(response: LoginResponse) {
  localStorage.setItem('token', response.token)
  localStorage.setItem('usuario', JSON.stringify(response.usuario))
}

export function limparSessao() {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
}

export function getToken(): string | null {
  return localStorage.getItem('token')
}

export function getUsuario(): UsuarioDto | null {
  const raw = localStorage.getItem('usuario')
  return raw ? (JSON.parse(raw) as UsuarioDto) : null
}
