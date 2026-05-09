import { Plus, Settings, Wand2, Info } from 'lucide-react'
import { useState } from 'react'
import { SidebarButton } from '@/components/SidebarButton'

const widgetOptions = ['Shortcut', 'Calender', 'Weather', 'Todos', 'Search', 'Clock']

function App() {
  const [showAbout, setShowAbout] = useState(false)
  const [showWidgets, setShowWidgets] = useState(false)

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-black text-white">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('./chatgpt_generated_003.png')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Main Content */}
      <div className="relative flex flex-1 flex-col gap-8 p-6">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">devKitTab</h1>
          <p className="text-sm text-slate-300 leading-relaxed max-w-xs">
            A polished Chrome extension popup built with React, Tailwind, and shadcn UI.
          </p>
        </div>

        <div className="space-y-3">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Features
            </h2>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>• Manifest V3 ready</li>
              <li>• Relative asset paths</li>
              <li>• Dark theme preset</li>
              <li>• Full Tailwind + shadcn</li>
            </ul>
          </div>
        </div>

        <div className="mt-auto space-y-3">
          <a
            href="https://developer.chrome.com/docs/extensions"
            target="_blank"
            rel="noreferrer"
            className="block border border-white/20 bg-white/5 px-4 py-2 text-sm text-white transition-all hover:bg-white/10 text-center"
          >
            Chrome Docs
          </a>
          <p className="text-[11px] text-slate-500 text-center">
            v0.0.0 • Ready to ship
          </p>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="relative flex w-16 flex-col items-center justify-between border-l border-white/10 bg-slate-950/30 p-3 backdrop-blur-sm">
        {/* Top Buttons */}
        <div className="flex flex-col gap-2">
          <SidebarButton icon={Wand2} label="Widget Edit mode" />
          <SidebarButton
            icon={Plus}
            label="Add Widget"
            onClick={() => setShowWidgets((current) => !current)}
          />
          <SidebarButton icon={Settings} label="Page Setting" />
        </div>

        {/* Bottom Button */}
        <SidebarButton 
          icon={Info} 
          label="About"
          onClick={() => setShowAbout(true)}
        />
      </div>

      {showWidgets && (
        <div className="absolute right-16 top-20 z-40 w-44 border border-white/15 bg-black/85 p-2 shadow-2xl backdrop-blur-xl">
          <div className="border-b border-white/10 px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-slate-400">
            Widgets
          </div>
          <div className="py-1">
            {widgetOptions.map((option) => (
              <button
                key={option}
                type="button"
                className="block w-full border-l-2 border-transparent px-3 py-2 text-left text-sm text-slate-200 transition-colors hover:border-white hover:bg-white/5 hover:text-white"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* About Modal Popup */}
      {showAbout && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 z-50">
          <div className="w-full max-w-sm border border-white/20 bg-black/80 backdrop-blur-xl p-8">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold mb-2">devKitTab</h1>
              <p className="text-slate-400 text-sm">v0.0.0</p>
            </div>

            {/* Description */}
            <p className="text-center text-slate-300 text-sm mb-8 leading-relaxed">
              A polished Chrome extension popup built with React, Tailwind, and shadcn UI.
            </p>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  /* Website link will be added here */
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-white/20 bg-white/5 text-white text-sm font-medium transition-colors hover:bg-white/10"
              >
                <span>Website</span>
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4m-4-6l6 6m0 0l-6 6m6-6H3" />
                </svg>
              </button>

              <button
                onClick={() => {
                  /* Developer Profile link will be added here */
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-white/20 bg-white/5 text-white text-sm font-medium transition-colors hover:bg-white/10"
              >
                <span>Developer Profile</span>
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowAbout(false)}
              className="mt-6 w-full px-4 py-2 border border-white/20 bg-white/5 text-white text-sm font-medium transition-colors hover:bg-white/10"
            >
              Close
            </button>

            {/* Footer */}
            <div className="mt-8 text-center text-[11px] text-slate-500">
              Ready to ship as a Chrome extension
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
