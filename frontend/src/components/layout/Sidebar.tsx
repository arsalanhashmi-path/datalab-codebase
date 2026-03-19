import { NavLink } from 'react-router-dom'

const links = [
  { to: '/',            label: 'Overview',    icon: '⬡' },
  { to: '/runs',        label: 'Run Log',     icon: '⏱' },
  { to: '/articles',   label: 'Articles',    icon: '📰' },
  { to: '/sections',   label: 'By Section',  icon: '📂' },
  { to: '/checkpoints', label: 'Checkpoints', icon: '🔖' },
]

export default function Sidebar() {
  return (
    <aside className="w-56 bg-brand-950 flex flex-col shrink-0">
      <div className="h-14 flex items-center px-5 border-b border-brand-800">
        <span className="font-display text-white text-lg font-bold tracking-tight">
          Datalab
        </span>
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
            <span className="text-base">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-brand-800">
        <p className="text-brand-400 text-xs">Dawn News Intelligence</p>
        <p className="text-brand-600 text-xs mt-0.5">v1.0</p>
      </div>
    </aside>
  )
}
