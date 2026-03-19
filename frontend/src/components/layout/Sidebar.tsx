import { NavLink } from 'react-router-dom'
import { useSource } from '../../contexts/SourceContext'
import { SOURCES, getSourceConfig } from '../../config/sources'

const links = [
  { to: '/',             label: 'Overview',    icon: '▦' },
  { to: '/runs',         label: 'Run Log',     icon: '◷' },
  { to: '/articles',    label: 'Articles',    icon: '▤' },
  { to: '/sections',    label: 'By Section',  icon: '▥' },
  { to: '/checkpoints', label: 'Checkpoints', icon: '◈' },
]

export default function Sidebar() {
  const { source, setSource } = useSource()
  const cfg = getSourceConfig(source)

  return (
    <aside className="w-56 bg-brand-950 flex flex-col shrink-0">
      <div className="h-14 flex items-center px-5 border-b border-brand-800">
        <span className="font-display text-white text-lg font-bold tracking-tight">
          Datalab
        </span>
      </div>

      {/* Source selector */}
      <div className="px-3 py-3 border-b border-brand-800">
        <p className="text-brand-500 text-xs uppercase tracking-wider mb-2 px-1">Source</p>
        {SOURCES.length === 1 ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-800">
            <span className="text-base leading-none">{cfg.flag}</span>
            <span className="text-sm font-semibold text-white">{cfg.label}</span>
            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-400" />
          </div>
        ) : (
          <select
            value={source}
            onChange={e => setSource(e.target.value)}
            className="w-full text-sm bg-brand-800 text-white border border-brand-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            {SOURCES.map(s => (
              <option key={s.id} value={s.id}>{s.flag} {s.label}</option>
            ))}
          </select>
        )}
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-500 text-white'
                  : 'text-brand-200 hover:bg-brand-800 hover:text-white'
              }`
            }
          >
            <span className="text-base leading-none">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-brand-800">
        <p className="text-brand-400 text-xs">{cfg.label} Intelligence</p>
        <p className="text-brand-600 text-xs mt-0.5">{cfg.domain}</p>
      </div>
    </aside>
  )
}
