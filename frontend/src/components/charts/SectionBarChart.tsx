import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import type { SectionStat } from '../../hooks/useSections'

interface Props { sections: SectionStat[] }

export default function SectionBarChart({ sections }: Props) {
  const top = sections.slice(0, 10)

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Top Sections by Article Count</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={top} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="section" tick={{ fontSize: 11 }} width={80} />
          <Tooltip />
          <Bar dataKey="count" fill="#289c5e" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
