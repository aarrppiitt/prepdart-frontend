// src/App.jsx
import React, { useRef, useMemo, useLayoutEffect, useState, useEffect } from "react"
import { MathJaxContext } from "better-react-mathjax"

import Sidebar from "@/components/layout/Sidebar"
import QuestionPreview from "@/components/question/QuestionPreview"
import SolutionPanel from "@/components/question/SolutionPanel"

import useQuestions from "@/hooks/useQuestions"
import useMetadata from "@/hooks/useMetaData"
import FiltersBar from "@/components/layout/FiltersBar"

const mathjaxConfig = {}

export default function App() {
  const { data: metadata, loading: metaLoading } = useMetadata()

  const [filters, setFilters] = useState(null)

  // All question fetching is now inside the hook.
  const { items, loading: questionsLoading, error: questionsError } = useQuestions(filters)

  // selection and hover
  const [selectedIds, setSelectedIds] = useState([])
  const selectedIdsSet = useMemo(() => new Set(selectedIds), [selectedIds])
  const [hoveredQuestion, setHoveredQuestion] = useState(null)

  const current = hoveredQuestion ?? items?.[0] ?? null

  // dynamic height
  const filterRef = useRef(null)
  const [filtersHeight, setFiltersHeight] = useState(0)

  useLayoutEffect(() => {
    const updateHeight = () => {
      if (filterRef.current) {
        setFiltersHeight(Math.ceil(filterRef.current.getBoundingClientRect().height))
      }
    }
    updateHeight()
    window.addEventListener("resize", updateHeight)
    return () => window.removeEventListener("resize", updateHeight)
  }, [])

  // Auto-set filters when metadata arrives
  useEffect(() => {
    if (!metadata) return

    const c = metadata.classes?.[0]
    if (!c) return

    const s = c.subjects?.[0]
    const ch = s?.chapters?.[0]
    const t = ch?.topics?.[0]

    const defaults = {
      classId: Number(c.id),
      subjectId: Number(s.id),
      chapterId: Number(ch.id),
      topicId: t ? Number(t.id) : undefined,
      questionLevelId: Number(metadata.questionLevels?.[0]?.id),
      questionTypeId: Number(metadata.questionTypes?.[0]?.id),
      removeUsedQuestions: true,
    }

    setFilters(prev => prev || defaults)
  }, [metadata])

  return (
    <MathJaxContext version={3} config={mathjaxConfig}>
      <div className="min-h-screen bg-gray-50">

        {/* Filters */}
        <div className="w-full bg-transparent">
          <div ref={filterRef} className="max-w-6xl mx-auto w-full px-4">
            <FiltersBar metadata={metadata} loading={metaLoading} onSubmit={setFilters} />
          </div>
        </div>

        {/* Main layout */}
        <div
          className="flex overflow-hidden"
          style={{ marginTop: 8, height: `calc(100vh - ${filtersHeight}px)` }}
        >
          {/* Sidebar */}
          <aside className="w-64 bg-white border-r overflow-auto p-3 flex-shrink-0">
            <Sidebar
              items={items}
              onSelect={setSelectedIds}
              selectedIds={selectedIdsSet}
              onHoverQuestion={setHoveredQuestion}
            />
          </aside>

          {/* Main Panel */}
          <main className=" flex-1 flex flex-col overflow-hidden min-w-0">
            <div className="overflow-auto min-w-0">
              <div className="bg-white rounded shadow p-4 h-full min-h-0 min-w-0">
                {questionsLoading ? (
                  <div className="p-6 text-gray-500">Loading questions…</div>
                ) : questionsError ? (
                  <div className="p-6 text-red-600">Failed to load questions</div>
                ) : (
                  <QuestionPreview question={current} />
                )}
              </div>
            </div>

            <div className="mt-4">
              <div className="bg-white rounded shadow p-4">
                <SolutionPanel solution={current?.solutionHtml} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </MathJaxContext>
  )
}
