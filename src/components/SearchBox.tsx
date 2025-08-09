import { useEffect, useMemo, useState } from 'react'

export type SearchBoxProps = {
  placeholder?: string
  items: string[]
  onPick: (value: string) => void
  variant?: 'default' | 'pill'
}

export default function SearchBox({ placeholder = 'Search…', items, onPick, variant = 'default' }: SearchBoxProps) {
  const [q, setQ] = useState('')
  const filtered = useMemo(
    () => items.filter((i) => i.toLowerCase().includes(q.toLowerCase())),
    [q, items]
  )

  useEffect(() => {
    // If there is exactly one match, auto-pick it for quick UX
    if (q && filtered.length === 1) onPick(filtered[0])
  }, [q, filtered, onPick])

  return (
    <div className="relative w-full">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className={
          variant === 'pill'
            ? 'w-full bg-transparent px-3 py-2 pr-9 text-sm outline-none placeholder:text-gray-600'
            : 'w-full rounded-xl border border-gray-300 bg-white/90 px-4 py-2 pr-9 shadow-sm outline-none ring-0 focus:border-brand-500 focus:bg-white'
        }
      />
      {!!q && (
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-sm text-gray-500 hover:text-gray-700"
          onClick={() => setQ('')}
        >
          ✕
        </button>
      )}
      {q && (
        <ul className="absolute z-[1000] mt-1 max-h-56 w-full overflow-auto rounded-lg border border-gray-200 bg-white/95 shadow backdrop-blur">
          {filtered.length === 0 && (
            <li className="px-3 py-2 text-sm text-gray-500">No matches</li>
          )}
          {filtered.map((name) => (
            <li
              key={name}
              className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-50"
              onClick={() => {
                onPick(name)
              }}
            >
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
