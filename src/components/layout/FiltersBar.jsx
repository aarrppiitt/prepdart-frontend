// src/components/layout/FiltersBar.jsx
import React, { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from "@/components/ui/select"

/**
 * FiltersBar — uses your existing radix wrapper but:
 * 1) forces remount of Select when option lists change (key prop)
 * 2) overrides trigger visuals via SelectTrigger className so it looks light-gray
 * 3) initializes all selects from metadata defaults (strings)
 */

export default function FiltersBar({ metadata, onSubmit, loading = false }) {
  const classes = metadata?.classes || []
  const questionLevels = metadata?.questionLevels || []
  const questionTypes = metadata?.questionTypes || []

  // compute defaults as strings (if metadata present)
  const defaults = useMemo(() => {
    if (!classes || classes.length === 0) return null
    const c = classes[0]
    const s = c?.subjects?.[0]
    const ch = s?.chapters?.[0]
    const t = ch?.topics?.[0]

    return {
      classId: c?.id ? String(c.id) : "",
      subjectId: s?.id ? String(s.id) : "",
      chapterId: ch?.id ? String(ch.id) : "",
      topicId: t?.id ? String(t.id) : "",
      questionLevelId: questionLevels?.[0]?.id ? String(questionLevels[0].id) : "",
      questionTypeId: questionTypes?.[0]?.id ? String(questionTypes[0].id) : "",
    }
  }, [classes, questionLevels, questionTypes])

  // local state as strings
  const [classId, setClassId] = useState("")
  const [subjectId, setSubjectId] = useState("")
  const [chapterId, setChapterId] = useState("")
  const [topicId, setTopicId] = useState("")
  const [questionLevelId, setQuestionLevelId] = useState("")
  const [questionTypeId, setQuestionTypeId] = useState("")

  // initialize states when defaults become available (one-shot when defaults appears)
  useEffect(() => {
    if (!defaults) return
    setClassId(defaults.classId)
    setSubjectId(defaults.subjectId)
    setChapterId(defaults.chapterId)
    setTopicId(defaults.topicId)
    setQuestionLevelId(defaults.questionLevelId)
    setQuestionTypeId(defaults.questionTypeId)
  }, [defaults])

  // derived lists
  const selectedClass = classes.find(c => String(c.id) === classId)
  const subjects = selectedClass?.subjects || []
  const selectedSubject = subjects.find(s => String(s.id) === subjectId)
  const chapters = selectedSubject?.chapters || []
  const selectedChapter = chapters.find(ch => String(ch.id) === chapterId)
  const topics = selectedChapter?.topics || []

  // cascade safety: if parent changes and child value invalid, pick first option
  useEffect(() => {
    if (!subjects.length) {
      setSubjectId("")
      setChapterId("")
      setTopicId("")
      return
    }
    if (!subjects.some(s => String(s.id) === subjectId)) {
      setSubjectId(String(subjects[0].id))
    }
    // eslint-disable-next-line
  }, [classId, subjects])

  useEffect(() => {
    if (!chapters.length) {
      setChapterId("")
      setTopicId("")
      return
    }
    if (!chapters.some(ch => String(ch.id) === chapterId)) {
      setChapterId(String(chapters[0].id))
    }
    // eslint-disable-next-line
  }, [subjectId, chapters])

  useEffect(() => {
    if (!topics.length) {
      setTopicId("")
      return
    }
    if (!topics.some(t => String(t.id) === topicId)) {
      setTopicId(String(topics[0].id))
    }
    // eslint-disable-next-line
  }, [chapterId, topics])

  function handleSubmit(e) {
    e?.preventDefault?.()
    onSubmit({
      classId: Number(classId),
      subjectId: Number(subjectId),
      chapterId: Number(chapterId),
      topicId: topicId ? Number(topicId) : undefined,
      questionLevelId: Number(questionLevelId),
      questionTypeId: Number(questionTypeId),
      removeUsedQuestions: true,
    })
  }

  function handleReset(e) {
    e?.preventDefault?.()
    if (!defaults) return
    setClassId(defaults.classId)
    setSubjectId(defaults.subjectId)
    setChapterId(defaults.chapterId)
    setTopicId(defaults.topicId)
    setQuestionLevelId(defaults.questionLevelId)
    setQuestionTypeId(defaults.questionTypeId)

    onSubmit({
      classId: Number(defaults.classId || 0),
      subjectId: Number(defaults.subjectId || 0),
      chapterId: Number(defaults.chapterId || 0),
      topicId: defaults.topicId ? Number(defaults.topicId) : undefined,
      questionLevelId: Number(defaults.questionLevelId || 0),
      questionTypeId: Number(defaults.questionTypeId || 0),
      removeUsedQuestions: true,
    })
  }

  // helper rendering
  const renderOptions = (list) =>
    (list || []).map((o) => (
      <SelectItem key={o.id} value={String(o.id)}>
        {o.label}
      </SelectItem>
    ))

  // Override class for SelectTrigger to force a light-gray, full-width pill (avoids black pill)
  const triggerOverrideClass =
    "!w-full min-w-0 !bg-gray-100 text-gray-900 border border-gray-200 rounded-md px-3 py-2 text-sm hover:bg-gray-200 focus:ring-2 focus:ring-blue-300 flex items-center justify-between"

  // When loading metadata, show simple skeleton
  if (loading) {
    return (
      <div className="h-[88px] flex items-center px-4 bg-white border-b">
        <div className="max-w-6xl mx-auto w-full">
          <div className="animate-pulse h-8 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border-b">
      <div className="px-4 py-3">
        <div className="flex items-center gap-4">

          <div className="flex-1 grid grid-cols-6 gap-3 min-w-0">

            {/* CLASS */}
            <div className="min-w-0">
              <div className="text-xs text-gray-600 mb-1">Class</div>
              <Select
                key={`class-${classes.length}-${classId}`}
                value={classId}
                onValueChange={v => setClassId(String(v || ""))}
                disabled={!classes.length}
              >
                <SelectTrigger className={triggerOverrideClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>{renderOptions(classes)}</SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* SUBJECT */}
            <div className="min-w-0">
              <div className="text-xs text-gray-600 mb-1">Subject</div>
              <Select
                key={`subject-${subjects.length}-${subjectId}`}
                value={subjectId}
                onValueChange={v => setSubjectId(String(v || ""))}
                disabled={!subjects.length}
              >
                <SelectTrigger className={triggerOverrideClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>{renderOptions(subjects)}</SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* CHAPTER */}
            <div className="min-w-0">
              <div className="text-xs text-gray-600 mb-1">Chapter</div>
              <Select
                key={`chapter-${chapters.length}-${chapterId}`}
                value={chapterId}
                onValueChange={v => setChapterId(String(v || ""))}
                disabled={!chapters.length}
              >
                <SelectTrigger className={triggerOverrideClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>{renderOptions(chapters)}</SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* TOPIC */}
            <div className="min-w-0">
              <div className="text-xs text-gray-600 mb-1">Topic</div>
              <Select
                key={`topic-${topics.length}-${topicId}`}
                value={topicId}
                onValueChange={v => setTopicId(String(v || ""))}
                disabled={!topics.length}
              >
                <SelectTrigger className={triggerOverrideClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>{renderOptions(topics)}</SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* LEVEL */}
            <div className="min-w-0">
              <div className="text-xs text-gray-600 mb-1">Level</div>
              <Select
                key={`level-${questionLevels.length}-${questionLevelId}`}
                value={questionLevelId}
                onValueChange={v => setQuestionLevelId(String(v || ""))}
                disabled={!questionLevels.length}
              >
                <SelectTrigger className={triggerOverrideClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>{renderOptions(questionLevels)}</SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* TYPE */}
            <div className="min-w-0">
              <div className="text-xs text-gray-600 mb-1">Type</div>
              <Select
                key={`type-${questionTypes.length}-${questionTypeId}`}
                value={questionTypeId}
                onValueChange={v => setQuestionTypeId(String(v || ""))}
                disabled={!questionTypes.length}
              >
                <SelectTrigger className={triggerOverrideClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>{renderOptions(questionTypes)}</SelectGroup>
                </SelectContent>
              </Select>
            </div>

          </div>

          <div className="flex items-center gap-3 mt-4">
            <Button type="submit" className="!bg-gray-100 hover:bg-gray-300 text-gray-900">Submit</Button>
          </div>
        </div>
      </div>
    </form>
  )
}
