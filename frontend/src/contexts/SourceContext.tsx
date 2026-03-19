import { createContext, useContext, useState } from 'react'
import { DEFAULT_SOURCE } from '../config/sources'

interface SourceContextValue {
  source: string
  setSource: (source: string) => void
}

const SourceContext = createContext<SourceContextValue>({
  source: DEFAULT_SOURCE,
  setSource: () => {},
})

export function SourceProvider({ children }: { children: React.ReactNode }) {
  const [source, setSource] = useState(DEFAULT_SOURCE)
  return (
    <SourceContext.Provider value={{ source, setSource }}>
      {children}
    </SourceContext.Provider>
  )
}

export function useSource() {
  return useContext(SourceContext)
}
