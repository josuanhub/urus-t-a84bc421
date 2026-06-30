import { useState, useCallback } from 'react'

const API_BASE = 'https://www.urusverify.com/v1/client/a84bc421-28d0-4551-81af-7aec26e13526/api'
const FACTORY_KEY = 'factory2026'

const buildHeaders = (customHeaders = {}) => ({
  'Content-Type': 'application/json',
  'x-factory-key': FACTORY_KEY,
  ...customHeaders
})

export const fetchApi = async (endpoint, options = {}) => {
  const { headers: customHeaders, body, ...restOptions } = options

  const config = {
    ...restOptions,
    headers: buildHeaders(customHeaders),
    ...(body && { body: typeof body === 'string' ? body : JSON.stringify(body) })
  }

  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  const response = await fetch(url, config)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }))
    const error = new Error(errorData.message || `HTTP error ${response.status}`)
    error.status = response.status
    error.data = errorData
    throw error
  }

  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return response.json()
  }

  return response.text()
}

const useApi = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = useCallback(async (endpoint, options = {}) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchApi(endpoint, options)
      return { data, error: null }
    } catch (err) {
      const errorInfo = {
        message: err.message,
        status: err.status || null,
        data: err.data || null
      }
      setError(errorInfo)
      return { data: null, error: errorInfo }
    } finally {
      setLoading(false)
    }
  }, [])

  const get = useCallback((endpoint, options = {}) =>
    request(endpoint, { ...options, method: 'GET' })
  , [request])

  const post = useCallback((endpoint, body, options = {}) =>
    request(endpoint, { ...options, method: 'POST', body })
  , [request])

  const put = useCallback((endpoint, body, options = {}) =>
    request(endpoint, { ...options, method: 'PUT', body })
  , [request])

  const patch = useCallback((endpoint, body, options = {}) =>
    request(endpoint, { ...options, method: 'PATCH', body })
  , [request])

  const del = useCallback((endpoint, options = {}) =>
    request(endpoint, { ...options, method: 'DELETE' })
  , [request])

  const clearError = useCallback(() => setError(null), [])

  return { loading, error, get, post, put, patch, del, request, clearError }
}

export default useApi