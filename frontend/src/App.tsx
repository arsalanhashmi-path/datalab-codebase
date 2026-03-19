import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SourceProvider } from './contexts/SourceContext'
import { RefreshProvider } from './contexts/RefreshContext'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import Overview from './pages/Overview'
import RunLog from './pages/RunLog'
import Articles from './pages/Articles'
import Sections from './pages/Sections'
import Checkpoints from './pages/Checkpoints'

export default function App() {
  return (
    <RefreshProvider>
    <SourceProvider>
      <BrowserRouter>
        <div className="flex h-screen bg-gray-50 font-sans">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Topbar />
            <main className="flex-1 overflow-y-auto p-8">
              <Routes>
                <Route path="/"            element={<Overview />} />
                <Route path="/runs"        element={<RunLog />} />
                <Route path="/articles"    element={<Articles />} />
                <Route path="/sections"    element={<Sections />} />
                <Route path="/checkpoints" element={<Checkpoints />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </SourceProvider>
    </RefreshProvider>
  )
}
