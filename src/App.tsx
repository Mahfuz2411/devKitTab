import { Plus, Settings, Wand2, Info, GripVertical, MoreVertical } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { SidebarButton } from '@/components/SidebarButton'
import ClockWidget from '@/widgets/ClockWidget'
import WeatherWidget from '@/widgets/WeatherWidget'
import SearchWidget from '@/widgets/SearchWidget'
import TodosWidget from '@/widgets/TodosWidget'
import CalendarWidget from '@/widgets/CalendarWidget'
import ShortcutWidget from '@/widgets/ShortcutWidget'
import { widgetOptions, widgetSizeByType } from '@/lib/widgets'

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

interface ResizeState {
  id: string
  startX: number
  startY: number
  startWidth: number
  startHeight: number
}

function App() {
  const [showAbout, setShowAbout] = useState(false)
  const [showWidgets, setShowWidgets] = useState(false)
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [editMode, setEditMode] = useState(false)
  const [dragState, setDragState] = useState<DragState | null>(null)
  const canvasRef = useRef<HTMLDivElement | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [resizeState, setResizeState] = useState<ResizeState | null>(null)

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
    setEditMode(true)
  }

  const removeWidget = (id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id))
  }

  const duplicateWidget = (id: string) => {
    setWidgets((prev) => {
      const src = prev.find((p) => p.id === id)
      if (!src) return prev
      const copy = {
        ...src,
        id: `${Date.now()}-${Math.random()}`,
        x: Math.min(src.x + 24, (canvasRef.current?.clientWidth ?? 800) - src.width),
        y: Math.min(src.y + 24, (canvasRef.current?.clientHeight ?? 600) - src.height),
      }
      return [...prev, copy]
    })
    setOpenMenuId(null)
  }

  const beginDrag = (event: ReactMouseEvent<HTMLElement>, widget: Widget) => {
    if (!editMode) {
      return
    }
    // locate the widget container element to compute offsets
    const el = (event.currentTarget as HTMLElement).closest(
      `[data-widget-id="${widget.id}"]`,
    ) as HTMLElement | null

    const rect = el ? el.getBoundingClientRect() : { left: 0, top: 0 }

    setDragState({
      id: widget.id,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
    })
  }

  const beginResize = (event: ReactMouseEvent<HTMLDivElement>, widget: Widget) => {
    if (!editMode) return
    event.stopPropagation()
    setResizeState({
      id: widget.id,
      startX: event.clientX,
      startY: event.clientY,
      startWidth: widget.width,
      startHeight: widget.height,
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

  useEffect(() => {
    if (!resizeState || !editMode) return

    const canvas = canvasRef.current
    if (!canvas) return

    const handleMouseMove = (event: MouseEvent) => {
      setWidgets((prev) =>
        prev.map((w) => {
          if (w.id !== resizeState.id) return w

          const dx = event.clientX - resizeState.startX
          const dy = event.clientY - resizeState.startY
          const canvasRect = canvas.getBoundingClientRect()

          const config = widgetSizeByType[w.type] ?? {
            width: 280,
            height: 180,
            minWidth: 160,
            minHeight: 100,
            maxWidth: 600,
            maxHeight: 400,
          }

          const minW = config.minWidth
          const minH = config.minHeight
          const maxW = Math.min(config.maxWidth, Math.max(200, canvasRect.width - w.x))
          const maxH = Math.min(config.maxHeight, Math.max(120, canvasRect.height - w.y))

          const newW = Math.min(Math.max(resizeState.startWidth + dx, minW), maxW)
          const newH = Math.min(Math.max(resizeState.startHeight + dy, minH), maxH)

          return { ...w, width: newW, height: newH }
        }),
      )
    }

    const handleMouseUp = () => setResizeState(null)

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [resizeState, editMode])

  useEffect(() => {
    const previousUserSelect = document.body.style.userSelect

    if (dragState || resizeState) {
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.body.style.userSelect = previousUserSelect
    }
  }, [dragState, resizeState])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId) {
        const target = event.target as HTMLElement
        const menuElement = document.querySelector(`[data-widget-id="${openMenuId}"]`)
        if (menuElement && !menuElement.contains(target)) {
          setOpenMenuId(null)
        }
      }
    }
    window.addEventListener('click', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [openMenuId])

  const renderWidgetBody = (type: string) => {
    const map: Record<string, React.FC> = {
      Clock: ClockWidget,
      Weather: WeatherWidget,
      Search: SearchWidget,
      Todos: TodosWidget,
      Calender: CalendarWidget,
      Shortcut: ShortcutWidget,
    }

    const C = map[type]
    if (C) return <C />

    return (
      <div className="space-y-2 text-slate-200">
        <div className="h-10 border border-white/10 bg-white/5" />
        <div className="h-10 border border-white/10 bg-white/5" />
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
              data-widget-id={widget.id}
              className={`absolute select-none border border-cyan-300/35 bg-black/45 shadow-[0_0_24px_rgba(34,211,238,0.18)] transition-colors ${
                editMode ? 'cursor-default' : 'cursor-default'
              }`}
              style={{
                left: `${widget.x}px`,
                top: `${widget.y}px`,
                width: `${widget.width}px`,
                height: `${widget.height}px`,
              }}
            >
              {/* Top menu button (on top border) */}
              {editMode && (
                <div className="absolute right-2 top-0 z-40 -translate-y-1/2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setOpenMenuId((current) => (current === widget.id ? null : widget.id))
                    }}
                    className="flex h-6 w-6 cursor-pointer items-center justify-center border border-white/10 bg-black/90 text-slate-300 hover:text-white"
                    title="Widget menu"
                  >
                    {openMenuId === widget.id ? (
                      <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <MoreVertical className="size-4" aria-hidden="true" />
                    )}
                  </button>

                  {openMenuId === widget.id && (
                    <div className="absolute top-full right-0 w-36 border border-white/10 bg-black/90 p-1 z-50">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenMenuId(null)
                        }}
                        className="block w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-white/5"
                      >
                        Settings
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenMenuId(null)
                        }}
                        className="block w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-white/5"
                      >
                        Style
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          duplicateWidget(widget.id)
                        }}
                        className="block w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-white/5"
                      >
                        Duplicate
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeWidget(widget.id)
                          setOpenMenuId(null)
                        }}
                        className="block w-full text-left px-3 py-2 text-sm text-rose-400 hover:bg-white/5"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Right-side drag button */}
              {editMode && (
                <div className="absolute right-0 top-1/2 z-30 -translate-y-1/2 translate-x-1/2">
                  <button
                    onMouseDown={(e) => beginDrag(e as ReactMouseEvent<HTMLElement>, widget)}
                    className="flex h-7 w-7 cursor-grab items-center justify-center border border-white/10 bg-black/90 text-slate-400 hover:text-white active:cursor-grabbing"
                    title="Drag widget"
                  >
                    <GripVertical className="size-4" aria-hidden="true" />
                  </button>
                </div>
              )}

              {/* Content area - shows scroll when content overflows */}
              <div className="absolute inset-0 h-full w-full overflow-auto px-4 py-4">
                {renderWidgetBody(widget.type)}
              </div>

              {/* Resizer (bottom-right) - styled as small corner square with inner square */}
              {editMode && (
                <div
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    beginResize(e as ReactMouseEvent<HTMLDivElement>, widget)
                  }}
                  className="absolute bottom-0 right-0 z-50 flex h-5 w-5 cursor-se-resize translate-x-1/2 translate-y-1/2 items-center justify-center"
                  title="Resize"
                >
                  <div className="h-3 w-3 border border-l-0 border-t-0 border-white/20 bg-black/10" />
                </div>
              )}
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
