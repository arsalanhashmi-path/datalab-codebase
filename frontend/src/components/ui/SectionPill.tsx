export default function SectionPill({ section }: { section: string | null }) {
  if (!section) return <span className="text-gray-400 text-xs">—</span>
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-brand-50 text-brand-700 border border-brand-200">
      {section}
    </span>
  )
}
