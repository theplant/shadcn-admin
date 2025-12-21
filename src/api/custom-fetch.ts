export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

type RequestConfig = {
  url: string
  method: string
  params?: Record<string, unknown>
  data?: unknown
  headers?: Record<string, string>
  signal?: AbortSignal
}

export const customFetch = async <T>(
  config: RequestConfig,
  _options?: RequestInit
): Promise<T> => {
  const { url, method, params, data, headers, signal } = config
  
  // Build URL with query params
  let fullUrl = url
  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, String(v)))
      } else if (value !== undefined && value !== null) {
        searchParams.append(key, String(value))
      }
    })
    const queryString = searchParams.toString()
    if (queryString) {
      fullUrl = `${url}?${queryString}`
    }
  }

  const response = await fetch(fullUrl, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: data ? JSON.stringify(data) : undefined,
    signal,
  })
  
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new ApiError(
      response.status,
      errorBody.code || 'UNKNOWN_ERROR',
      errorBody.message || `HTTP ${response.status}`,
      errorBody.details
    )
  }
  
  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T
  }
  
  return response.json()
}
