import type { LucideIcon } from 'lucide-react'

interface SidebarButtonProps {
  icon: LucideIcon
  label: string
  onClick?: () => void
}

export function SidebarButton({ icon: Icon, label, onClick }: SidebarButtonProps) {
  return (
    <button
      onClick={onClick}
      className="group relative flex h-10 w-10 items-center justify-center border border-white/10 bg-white/5 text-slate-300 transition-all hover:bg-white/10 hover:text-white"
      title={label}
    >
      <Icon className="size-5" aria-hidden="true" />
      <div className="pointer-events-none absolute right-full top-1/2 mr-2 -translate-y-1/2 whitespace-nowrap bg-black/80 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
        {label}
      </div>
    </button>
  )
}
