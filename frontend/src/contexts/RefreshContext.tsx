import { createContext, useContext, useEffect, useRef, useState } from 'react'

const INTERVAL = 30

interface RefreshCtx {
  countdown: number
  tick: number
}

const RefreshContext = createContext<RefreshCtx>({ countdown: INTERVAL, tick: 0 })

export function RefreshProvider({ children }: { children: React.ReactNode }) {
  const [countdown, setCountdown] = useState(INTERVAL)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          setTick(t => t + 1)
          return INTERVAL
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <RefreshContext.Provider value={{ countdown, tick }}>
      {children}
    </RefreshContext.Provider>
  )
}

export function useRefresh() {
  return useContext(RefreshContext)
}
