import { useState, useCallback } from 'react'

const BASE_URL = 'https://www.urusverify.com/v1/client/a84bc421-28d0-4551-81af-7aec26e13526/api'
const FACTORY_KEY = 'factory2026'

const buildHeaders = (extra = {}) => ({
  'Content-Type': 'application/json',
  'x-factory-key': FACTORY_KEY,
  ...extra
})

export async function fetchApi(endpoint, options = {}) {
  const { headers: extraHeaders, body, ...rest } = options

  const config = {
    ...rest,
    headers: buildHeaders(extraHeaders),
    ...(body !== undefined && { body: JSON.stringify(body) })
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }))
    throw new Error(errorData.message || `HTTP error ${response.status}`)
  }

  const text = await response.text()
  return text ? JSON.parse(text) : null
}

export function useApi() {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
  const [data,    setData]    = useState(null)

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

  const get    = useCallback((endpoint, headers) =>
    request(endpoint, { method: 'GET', headers }), [request])

  const post   = useCallback((endpoint, body, headers) =>
    request(endpoint, { method: 'POST', body, headers }), [request])

  const put    = useCallback((endpoint, body, headers) =>
    request(endpoint, { method: 'PUT', body, headers }), [request])

  const patch  = useCallback((endpoint, body, headers) =>
    request(endpoint, { method: 'PATCH', body, headers }), [request])

  const remove = useCallback((endpoint, headers) =>
    request(endpoint, { method: 'DELETE', headers }), [request])

  return { data, loading, error, request, get, post, put, patch, remove }
}