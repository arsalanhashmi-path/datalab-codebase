import { useEffect, useState, useCallback } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { supabase } from '../../lib/supabase'
import { useAutoRefresh } from '../../hooks/useAutoRefresh'
import { useSource } from '../../contexts/SourceContext'

interface DayCount { day: string; count: number }

export default function WeeklyBarChart() {
  const { source } = useSource()
  const [data, setData] = useState<DayCount[]>([])

  const fetch = useCallback(async () => {
    const { data: rows } = await supabase.rpc('articles_per_day', { p_source: source, p_days: 7 })
    setData((rows ?? []).map((r: { day: string; count: number }) => ({
      day: new Date(r.day).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      count: Number(r.count),
    })))
  }, [source])

  useEffect(() => { fetch() }, [fetch])
  useAutoRefresh(fetch)

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Articles — Last 7 Days</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="day" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="count" fill="#289c5e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
