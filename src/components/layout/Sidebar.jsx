export default function Sidebar({
  items = [],
  onSelect,
  selectedIds = [],
  onHoverQuestion
}) {
  const selectedSet = new Set(selectedIds);

  function toggleSelection(id) {
    const next = new Set(selectedSet);
    if (next.has(id)) next.delete(id);
    else next.add(id);

    onSelect(Array.from(next));   // send array to parent
  }

  return (
    <aside className="w-64 bg-gray-50 border-r overflow-auto p-3">
      <ul className="space-y-1">
        {items.map((q, idx) => {
          const id = q.id ?? idx;
          const isSelected = selectedSet.has(id);

          return (
            <li
              key={id}
              onClick={() => toggleSelection(id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => handleKeyToggle(e, id)}
              onMouseEnter={() => onHoverQuestion && onHoverQuestion(q)}
              onMouseLeave={() => onHoverQuestion && onHoverQuestion(null)}
              className={`
    group relative flex items-center justify-between
    px-3 py-2 rounded-md border
    transition-all duration-150
    overflow-hidden w-full box-border select-none cursor-pointer
    ${isSelected
                  ? "bg-gray-500 border-gray-500 text-white"
                  : "bg-white border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                }
  `}
            >
              {/* Left accent strip (absolute, doesn't change layout) */}
              <div
                className={`absolute left-0 top-0 w-1 h-full transition-all ${isSelected ? "bg-gray-600" : "group-hover:bg-gray-400/40"}`}
                aria-hidden="true"
              />

              <div className="relative z-10 text-sm truncate max-w-[10rem] min-w-0">
                {q.preview || q.title || `Q ${id}`}
              </div>

              <span className={`relative z-10 text-xs ${isSelected ? "text-white/90" : "text-gray-400 group-hover:text-gray-600"}`}>
                #{idx + 1}
              </span>
            </li>

          );
        })}
      </ul>
    </aside>
  );
}
