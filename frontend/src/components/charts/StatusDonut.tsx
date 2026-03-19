import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { supabase } from '../../lib/supabase'
import { useAutoRefresh } from '../../hooks/useAutoRefresh'

const COLORS: Record<string, string> = {
  success: '#289c5e',
  partial: '#f59e0b',
  failed:  '#ef4444',
  running: '#3b82f6',
}

export default function StatusDonut() {
  const [data, setData] = useState<{ status: string; count: number }[]>([])

  const fetch = async () => {
    const { data: rows } = await supabase.rpc('run_outcomes', { p_source: 'dawn', p_hours: 24 })
    setData((rows ?? []).map((r: { status: string; count: number }) => ({
      status: r.status,
      count: Number(r.count),
    })))
  }

  useEffect(() => { fetch() }, [])
  useAutoRefresh(fetch)

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Run Outcomes — Last 24h</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={50} outerRadius={80}>
            {data.map(entry => (
              <Cell key={entry.status} fill={COLORS[entry.status] ?? '#999'} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
