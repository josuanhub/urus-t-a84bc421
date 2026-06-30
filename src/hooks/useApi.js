import { useState, useCallback } from 'react'

const BASE_URL    = 'https://www.urusverify.com/v1/client/a84bc421-28d0-4551-81af-7aec26e13526/api'
const FACTORY_KEY = 'factory2026'

/**
 * fetchApi — cliente HTTP base
 * @param {string} endpoint  - ruta relativa, ej: '/users'
 * @param {RequestInit} options - opciones nativas de fetch (method, body, etc.)
 * @returns {Promise<any>} datos JSON de la respuesta
 */
export async function fetchApi(endpoint = '', options = {}) {
  const url = `${BASE_URL}${endpoint}`

  const headers = {
    'Content-Type': 'application/json',
    'x-factory-key': FACTORY_KEY,
    ...options.headers
  }

  const config = {
    ...options,
    headers
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(
      `API Error ${response.status} ${response.statusText}: ${errorBody}`
    )
  }

  const contentType = response.headers.get('content-type') ?? ''
  return contentType.includes('application/json')
    ? response.json()
    : response.text()
}

/**
 * useApi — hook React para consumir fetchApi con estado
 * @returns {{ data, loading, error, request }}
 *
 * Ejemplo:
 *   const { data, loading, error, request } = useApi()
 *   useEffect(() => { request('/endpoint') }, [])
 */
export function useApi() {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const request = useCallback(async (endpoint = '', options = {}) => {
    setLoading(true)
    setError(null)
    setData(null)

    try {
      const result = await fetchApi(endpoint, options)
      setData(result)
      return result
    } catch (err) {
      setError(err.message ?? 'Error desconocido')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, error, request }
}