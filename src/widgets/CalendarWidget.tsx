import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function CalendarWidget() {
  const today = new Date()
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth())
  const [selectedYear, setSelectedYear] = useState(today.getFullYear())
  const [showDropdown, setShowDropdown] = useState(false)
  const [tempMonth, setTempMonth] = useState(selectedMonth)
  const [tempYear, setTempYear] = useState(selectedYear)

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      selectedMonth === today.getMonth() &&
      selectedYear === today.getFullYear()
    )
  }

  const goToPreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11)
      setSelectedYear(selectedYear - 1)
    } else {
      setSelectedMonth(selectedMonth - 1)
    }
  }

  const goToNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0)
      setSelectedYear(selectedYear + 1)
    } else {
      setSelectedMonth(selectedMonth + 1)
    }
  }

  const applyDateSelection = () => {
    setSelectedMonth(tempMonth)
    setSelectedYear(tempYear)
    setShowDropdown(false)
  }

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const firstDayOfWeek = getFirstDayOfMonth(selectedYear, selectedMonth)
  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth)

  const days: (number | null)[] = [
    ...Array.from({ length: firstDayOfWeek }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const weeks = Array.from({ length: Math.ceil(days.length / 7) }, (_, i) =>
    days.slice(i * 7, (i + 1) * 7)
  )

  return (
    <div className="h-full w-full flex flex-col">
      {/* Header with navigation */}
      <div className="flex items-center justify-between gap-1 pb-2">
        <button
          onClick={goToPreviousMonth}
          className="flex h-5 w-5 items-center justify-center border border-cyan-200/30 bg-black/30 text-cyan-200 hover:text-cyan-100 text-xs"
          title="Previous month"
        >
          <ChevronLeft className="size-3" />
        </button>

        <div className="relative flex-1 min-w-0">
          <button
            onClick={() => {
              setShowDropdown(!showDropdown)
              setTempMonth(selectedMonth)
              setTempYear(selectedYear)
            }}
            className="w-full text-center text-xs font-semibold text-cyan-100 hover:text-cyan-50 cursor-pointer truncate"
          >
            {monthNames[selectedMonth]}, {selectedYear}
          </button>

          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 z-20 border border-cyan-200/30 bg-black/90 p-2 space-y-2">
              <div className="space-y-1">
                <label className="text-xs text-cyan-200/70">Month</label>
                <select
                  value={tempMonth}
                  onChange={(e) => setTempMonth(Number(e.target.value))}
                  className="w-full text-xs px-2 py-1 border border-cyan-200/30 bg-black/50 text-cyan-100"
                >
                  {monthNames.map((m, i) => (
                    <option key={i} value={i}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-cyan-200/70">Year</label>
                <select
                  value={tempYear}
                  onChange={(e) => setTempYear(Number(e.target.value))}
                  className="w-full text-xs px-2 py-1 border border-cyan-200/30 bg-black/50 text-cyan-100"
                >
                  {Array.from({ length: 21 }, (_, i) => tempYear - 10 + i).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={applyDateSelection}
                className="w-full text-xs px-2 py-1 border border-cyan-200/30 bg-cyan-900/40 text-cyan-100 hover:bg-cyan-800/40"
              >
                Apply
              </button>
            </div>
          )}
        </div>

        <button
          onClick={goToNextMonth}
          className="flex h-5 w-5 items-center justify-center border border-cyan-200/30 bg-black/30 text-cyan-200 hover:text-cyan-100 text-xs"
          title="Next month"
        >
          <ChevronRight className="size-3" />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="flex-1 flex flex-col gap-1 min-h-0">
        <div className="grid grid-cols-7 gap-1">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-xs font-semibold text-cyan-200/70 text-center px-1 py-1">
              {day.slice(0, 2)}
            </div>
          ))}
        </div>
        <div className="flex-1 flex flex-col gap-1 min-h-0">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="grid grid-cols-7 gap-1">
              {week.map((day, dIdx) => (
                <div
                  key={dIdx}
                  className={`text-xs py-1 px-1 text-center ${
                    isToday(day!)
                      ? 'text-cyan-100 border border-cyan-300/50 bg-cyan-900/30'
                      : day
                        ? 'text-cyan-100/60'
                        : 'text-slate-600'
                  }`}
                >
                  {day || ''}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
