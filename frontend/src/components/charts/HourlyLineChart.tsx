import { useEffect, useState, useCallback } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { supabase } from '../../lib/supabase'
import { useAutoRefresh } from '../../hooks/useAutoRefresh'
import { useSource } from '../../contexts/SourceContext'

interface HourCount { hour: number; count: number }

export default function HourlyLineChart() {
  const { source } = useSource()
  const [data, setData] = useState<HourCount[]>([])

  const fetch = useCallback(async () => {
    const { data: rows } = await supabase.rpc('articles_per_hour', { p_source: source })
    const map = new Map((rows ?? []).map((r: HourCount) => [r.hour, Number(r.count)]))
    setData(Array.from({ length: 24 }, (_, h): HourCount => ({ hour: h, count: map.get(h) ?? 0 })))
  }, [source])

  useEffect(() => { fetch() }, [fetch])
  useAutoRefresh(fetch)

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Articles Today — By Hour</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="hour" tick={{ fontSize: 11 }} tickFormatter={h => `${h}:00`} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip labelFormatter={h => `${h}:00`} />
          <Line type="monotone" dataKey="count" stroke="#289c5e" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
