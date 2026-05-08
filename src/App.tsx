import {
  ArrowRight,
  BadgeCheck,
  Globe,
  ExternalLink,
  Layers3,
  Puzzle,
  Sparkles,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

const capabilities = [
  {
    icon: Sparkles,
    title: 'Popup shell',
    description: 'Your React UI now opens from the Chrome toolbar.',
  },
  {
    icon: Puzzle,
    title: 'Manifest V3',
    description: 'The production build includes a Chrome extension manifest.',
  },
  {
    icon: Layers3,
    title: 'Relative assets',
    description: 'Vite is configured so built assets resolve correctly inside an extension.',
  },
]

const steps = [
  'Run `npm run build`',
  'Open `chrome://extensions`',
  'Enable Developer mode',
  'Load the `dist/` folder as an unpacked extension',
]

function App() {
  return (
    <main className="relative min-h-screen w-[380px] overflow-hidden bg-[#07111f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(77,208,225,0.18),_transparent_46%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.08),_transparent_32%)]" />

      <div className="relative flex min-h-screen flex-col gap-4 p-4">
        <header className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-cyan-200/80">
              <Globe className="size-4" aria-hidden="true" />
              Chrome Extension Ready
            </div>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium text-emerald-200">
              <BadgeCheck className="size-3.5" aria-hidden="true" />
              Manifest V3
            </span>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                devKitTab
              </h1>
              <p className="max-w-[30ch] text-sm leading-6 text-slate-300">
                A polished popup shell for your React + Tailwind + shadcn project, ready to ship as a Chrome extension.
              </p>
            </div>

            <div className="grid gap-2">
              {capabilities.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 rounded-2xl border border-white/8 bg-slate-950/35 px-3 py-3"
                >
                  <div className="rounded-xl bg-cyan-400/10 p-2 text-cyan-200 ring-1 ring-cyan-300/20">
                    <item.icon className="size-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{item.title}</p>
                    <p className="mt-0.5 text-xs leading-5 text-slate-400">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </header>

        <section className="rounded-3xl border border-white/10 bg-slate-950/40 p-4 shadow-xl backdrop-blur-xl">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-white">
            <Sparkles className="size-4 text-cyan-300" aria-hidden="true" />
            Load it in Chrome
          </div>

          <ol className="space-y-2 text-sm text-slate-300">
            {steps.map((step, index) => (
              <li key={step} className="flex gap-3 rounded-2xl border border-white/8 bg-white/3 px-3 py-2.5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px] font-semibold text-slate-100">
                  {index + 1}
                </span>
                <span className="leading-5">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <footer className="mt-auto grid gap-2 sm:grid-cols-2">
          <Button asChild className="h-10 rounded-2xl bg-cyan-400 text-slate-950 hover:bg-cyan-300">
            <a
              href="https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world"
              target="_blank"
              rel="noreferrer"
            >
              Chrome docs
              <ExternalLink className="size-4" aria-hidden="true" />
            </a>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-10 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
          >
            <a href="https://chrome.google.com/webstore/devconsole" target="_blank" rel="noreferrer">
              Store console
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </Button>
        </footer>
      </div>
    </main>
  )
}

export default App
