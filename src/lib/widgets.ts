export const widgetOptions = ['Shortcut', 'Calender', 'Weather', 'Todos', 'Search', 'Clock']

export const widgetSizeByType: Record<
  string,
  { width: number; height: number; minWidth: number; minHeight: number; maxWidth: number; maxHeight: number }
> = {
  Shortcut: { width: 320, height: 160, minWidth: 260, minHeight: 140, maxWidth: 600, maxHeight: 350 },
  Calender: { width: 320, height: 220, minWidth: 240, minHeight: 200, maxWidth: 700, maxHeight: 500 },
  Weather: { width: 400, height: 320, minWidth: 320, minHeight: 280, maxWidth: 800, maxHeight: 600 },
  Todos: { width: 320, height: 220, minWidth: 280, minHeight: 200, maxWidth: 600, maxHeight: 450 },
  Search: { width: 320, height: 150, minWidth: 280, minHeight: 120, maxWidth: 600, maxHeight: 300 },
  Clock: { width: 260, height: 170, minWidth: 220, minHeight: 140, maxWidth: 500, maxHeight: 350 },
}
