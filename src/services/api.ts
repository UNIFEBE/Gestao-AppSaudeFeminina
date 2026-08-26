const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://localhost:5201'

interface ApiError {
  mensagem?: string
  title?: string
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const { headers: extraHeaders, ...restOptions } = options ?? {}

  const response = await fetch(`${BASE_URL}${path}`, {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(extraHeaders as Record<string, string>),
    },
  })

  if (!response.ok) {
    let mensagem = `Erro ${response.status}`
    try {
      const body: ApiError = await response.json()
      mensagem = body.mensagem ?? body.title ?? mensagem
    } catch {
      // sem body JSON
    }
    throw new Error(mensagem)
  }

  if (response.status === 204) return undefined as T

  return response.json() as Promise<T>
}

export function get<T>(path: string, token?: string) {
  return request<T>(path, {
    method: 'GET',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
}

export function post<T>(path: string, body: unknown, token?: string) {
  return request<T>(path, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
}

export function put<T>(path: string, body: unknown, token?: string) {
  return request<T>(path, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
}
