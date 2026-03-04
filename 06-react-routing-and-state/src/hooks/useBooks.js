/**
 * useBooks — Custom Hook for Book Data
 *
 * Encapsulates the fetch logic so any page can use it without duplicating code.
 * This is the "Custom Hook" pattern: extract reusable stateful logic.
 */
import { useState, useEffect, useCallback } from 'react'

const API = 'http://localhost:3000/api'

export function useBooks() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchBooks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API}/books`)
      if (!res.ok) throw new Error(`Server returned ${res.status}`)
      setBooks(await res.json())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchBooks() }, [fetchBooks])

  return { books, loading, error, refetch: fetchBooks }
}
