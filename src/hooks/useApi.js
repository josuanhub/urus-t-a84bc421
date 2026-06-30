import { useState, useCallback } from 'react'

const BASE_URL    = 'https://www.urusverify.com/v1/client/a84bc421-28d0-4551-81af-7aec26e13526/api'
const FACTORY_KEY = 'factory2026'

/**
 * Realiza una petición autenticada a la API.
 * @param {string} endpoint  - Ruta relativa, ej: '/users'
 * @param {RequestInit} options - Opciones fetch adicionales
 * @returns {Promise<any>} - JSON de respuesta
 */
export async function fetchApi(endpoint = '', options = {}) {
  const url = `${BASE_URL}${endpoint}`

  const headers = {
    'Content-Type':  'application/json',
    'x-factory-key': FACTORY_KEY,
    ...options.headers
  }

  const response = await fetch(url, {
    ...options,
    headers
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }))
    throw new Error(error.message || `HTTP error ${response.status}`)
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    return response.json()
  }

  return response.text()
}

/**
 * Hook para consumir fetchApi con estados loading / error / data.
 * @returns {{ data, loading, error, request }}
 */
export function useApi() {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const request = useCallback(async (endpoint, options = {}) => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchApi(endpoint, options)
      setData(result)
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, error, request }
}