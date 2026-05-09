import { Plus, Settings, Wand2, Info, GripVertical, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { SidebarButton } from '@/components/SidebarButton'

const widgetOptions = ['Shortcut', 'Calender', 'Weather', 'Todos', 'Search', 'Clock']

const widgetSizeByType: Record<string, { width: number; height: number }> = {
  Shortcut: { width: 320, height: 160 },
  Calender: { width: 320, height: 220 },
  Weather: { width: 280, height: 210 },
  Todos: { width: 320, height: 220 },
  Search: { width: 320, height: 150 },
  Clock: { width: 260, height: 170 },
}

interface Widget {
  id: string
  type: string
  x: number
  y: number
  width: number
  height: number
}

interface DragState {
  id: string
  offsetX: number
  offsetY: number
}

function App() {
  const [showAbout, setShowAbout] = useState(false)
  const [showWidgets, setShowWidgets] = useState(false)
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [editMode, setEditMode] = useState(false)
  const [dragState, setDragState] = useState<DragState | null>(null)
  const canvasRef = useRef<HTMLDivElement | null>(null)

  const addWidget = (type: string) => {
    const size = widgetSizeByType[type] ?? { width: 280, height: 180 }
    const index = widgets.length
    const startX = 20 + (index % 2) * 340
    const startY = 20 + Math.floor(index / 2) * 190

    setWidgets((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        type,
        x: startX,
        y: startY,
        width: size.width,
        height: size.height,
      },
    ])
    setShowWidgets(false)
  }

  const removeWidget = (id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id))
  }

  const beginDrag = (event: ReactMouseEvent<HTMLDivElement>, widget: Widget) => {
    if (!editMode) {
      return
    }

    const rect = event.currentTarget.getBoundingClientRect()

    setDragState({
      id: widget.id,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
    })
  }

  useEffect(() => {
    if (!dragState || !editMode) {
      return
    }

    const handleMouseMove = (event: MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas) {
        return
      }

      const canvasRect = canvas.getBoundingClientRect()

      setWidgets((prev) =>
        prev.map((widget) => {
          if (widget.id !== dragState.id) {
            return widget
          }

          const rawX = event.clientX - canvasRect.left - dragState.offsetX
          const rawY = event.clientY - canvasRect.top - dragState.offsetY

          const maxX = Math.max(0, canvasRect.width - widget.width)
          const maxY = Math.max(0, canvasRect.height - widget.height)

          return {
            ...widget,
            x: Math.min(Math.max(0, rawX), maxX),
            y: Math.min(Math.max(0, rawY), maxY),
          }
        }),
      )
    }

    const handleMouseUp = () => {
      setDragState(null)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragState, editMode])

  const renderWidgetBody = (type: string) => {
    if (type === 'Clock') {
      return (
        <div className="space-y-2">
          <p className="text-5xl font-bold leading-none text-cyan-100">21:29</p>
          <p className="text-sm text-cyan-200/80">Sat, May 9</p>
        </div>
      )
    }

    if (type === 'Weather') {
      return (
        <div className="space-y-2">
          <p className="text-5xl font-bold leading-none text-cyan-100">17C</p>
          <p className="text-sm text-cyan-200/80">Cloudy • New York</p>
        </div>
      )
    }

    if (type === 'Search') {
      return (
        <div className="space-y-3">
          <div className="border border-cyan-200/30 bg-black/30 px-3 py-2 text-sm text-cyan-100">
            Search Google
          </div>
          <p className="text-xs text-slate-300">Quick search widget</p>
        </div>
      )
    }

    if (type === 'Todos') {
      return (
        <div className="space-y-2 text-sm text-slate-200">
          <p>1. Prepare meeting notes</p>
          <p>2. Check extension QA</p>
          <p>3. Push next release</p>
        </div>
      )
    }

    if (type === 'Calender') {
      return (
        <div className="space-y-2">
          <p className="text-lg font-semibold text-cyan-100">May, 2026</p>
          <p className="text-sm text-slate-300">Calendar preview widget</p>
        </div>
      )
    }

    return (
      <div className="space-y-2">
        <p className="text-sm text-slate-200">Shortcut panel</p>
        <p className="text-xs text-slate-400">Pinned app shortcuts will appear here</p>
      </div>
    )
  }

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

      {/* Widget Canvas */}
      <div className="relative flex flex-1 p-6">
        <div ref={canvasRef} className="relative h-full w-full border border-white/10 bg-black/20 backdrop-blur-[1px]">
          {widgets.map((widget) => (
            <div
              key={widget.id}
              onMouseDown={(event) => beginDrag(event, widget)}
              className={`absolute border border-cyan-300/35 bg-black/45 p-4 shadow-[0_0_24px_rgba(34,211,238,0.18)] transition-colors ${
                editMode ? 'cursor-move' : 'cursor-default'
              }`}
              style={{
                left: `${widget.x}px`,
                top: `${widget.y}px`,
                width: `${widget.width}px`,
                height: `${widget.height}px`,
              }}
            >
              <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-sm font-semibold text-cyan-100">{widget.type}</span>
                {editMode ? (
                  <div className="flex items-center gap-2">
                    <GripVertical className="size-4 text-slate-400" aria-hidden="true" />
                    <button
                      onClick={() => removeWidget(widget.id)}
                      className="text-slate-400 transition-colors hover:text-red-400"
                      title="Remove widget"
                    >
                      <X className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-400">Widget</span>
                )}
              </div>
              {renderWidgetBody(widget.type)}
            </div>
          ))}

          {widgets.length === 0 && (
            <div className="flex h-full items-center justify-center px-6 text-center">
              <div>
                <p className="text-sm text-slate-300">This area is reserved for user-added widgets.</p>
                <p className="mt-2 text-xs text-slate-400">Use the Add Widget button from the sidebar to place widgets here.</p>
              </div>
            </div>
          )}

          {editMode && widgets.length > 0 && (
            <div className="absolute bottom-2 left-2 border border-white/15 bg-black/50 px-3 py-1 text-[11px] text-slate-300">
              Edit mode on: Drag any widget to set its position.
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="relative flex w-16 flex-col items-center justify-between border-l border-white/10 bg-slate-950/30 p-3 backdrop-blur-sm">
        {/* Top Buttons */}
        <div className="flex flex-col gap-2">
          <SidebarButton
            icon={Wand2}
            label={editMode ? 'Exit Edit mode' : 'Widget Edit mode'}
            onClick={() => setEditMode((current) => !current)}
          />
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
                onClick={() => addWidget(option)}
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
