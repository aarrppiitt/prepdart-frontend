// src/hooks/useMetadata.js
import { useEffect, useState } from "react"
import { apiFetch } from "@/lib/apiClient"

export default function useMetadata() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const res = await apiFetch("/courses/metadata")
        if (!cancelled) setData(res)
      } catch (e) {
        if (!cancelled) setError(e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return { data, loading, error }
}
