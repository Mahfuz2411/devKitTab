import { Plus, Settings, Wand2, Info } from 'lucide-react'
import { SidebarButton } from '@/components/SidebarButton'

function App() {
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
          <SidebarButton icon={Plus} label="Add Widget" />
          <SidebarButton icon={Settings} label="Page Setting" />
        </div>

        {/* Bottom Button */}
        <SidebarButton icon={Info} label="About" />
      </div>
    </div>
  )
}

export default App
