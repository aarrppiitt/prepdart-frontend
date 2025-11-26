// src/components/question/OptionsList.jsx
import { MathJax } from 'better-react-mathjax'

export default function OptionsList({ options = {} }) {
  // read correct option stored in options.correct (e.g. 'a')
  const correct = String(options.correct || '').toLowerCase()

  // preferred order — keeps options in a,b,c,d order if present
  const preferred = ['a', 'b', 'c', 'd']

  // filter out the metadata key 'correct' and keep only actual option keys
  const keys = preferred.filter(k => options[k] !== undefined && options[k] !== null)

  if (keys.length === 0) return null

  return (
    <div className="grid grid-cols-2 gap-4">
      {keys.map((k) => {
        const isCorrect = String(k).toLowerCase() === correct // proper comparison
        return (
          <MathJax dynamic key={k}>
            <div
              role="listitem"
              aria-label={`Option ${k.toUpperCase()}${isCorrect ? ' correct' : ''}`}
              className={`flex items-center gap-3 p-3 rounded-lg border transition
                ${isCorrect
                  ? 'bg-green-50 border-green-200 shadow-sm'
                  : 'bg-white border-gray-200'}
              `}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-medium
                  ${isCorrect ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}
                `}
              >
                {k.toUpperCase()}
              </div>

              <div className="flex-1 text-sm leading-snug min-w-0">
                <div
                  className={`${isCorrect ? 'text-green-800' : 'text-gray-800'}`}
                  dangerouslySetInnerHTML={{ __html: options[k] }}
                />
              </div>

              {isCorrect && (
                <div className="flex items-center ml-2">
                  {/* green tick icon */}
                  <svg
                    className="w-5 h-5 text-green-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15 4.293 10.879a1 1 0 011.414-1.414L8.414 12.172l6.879-6.879a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </MathJax>
        )
      })}
    </div>
  )
}
