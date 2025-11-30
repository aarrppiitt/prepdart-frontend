import { useEffect, useState } from "react"
import { apiFetch } from "@/lib/apiClient"

export default function useQuestions(filters) {

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // ❌ No filters → do not fetch anything
    if (!filters) {
      setItems([])
      return
    }

    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const qs = new URLSearchParams()

        if (filters.classId != null) qs.set("classId", filters.classId)
        if (filters.subjectId != null) qs.set("subjectId", filters.subjectId)
        if (filters.chapterId != null) qs.set("chapterId", filters.chapterId)
        if (filters.topicId != null) qs.set("topicId", filters.topicId)

        // backend expects these names ↓
        if (filters.questionLevelId != null)
          qs.set("question_level_dd", filters.questionLevelId)

        if (filters.questionTypeId != null)
          qs.set("question_type_dd", filters.questionTypeId)

        qs.set("remove_used_questions", filters.removeUsedQuestions === false ? "false" : "true")

        const url = `/questions/retrieve?${qs.toString()}`

        const res = await apiFetch(url, { cache: "no-store" })

        if (!cancelled) {
          setItems(res?.items || [])
        }

      } catch (err) {
        if (!cancelled) setError(err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }

  }, [filters])

  return {
    items,
    loading,
    error,
    setItems,
  }
}
