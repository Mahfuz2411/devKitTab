import { Cloud, CloudRain, MoonStar, SunMedium } from 'lucide-react'
import { useMemo, useState } from 'react'

export default function WeatherWidget() {
  const [activeTab, setActiveTab] = useState<'current' | 'hourly' | 'weekly'>('current')

  const currentWeather = {
    temp: 12,
    location: 'New York',
    time: 'Sun 7:53 AM',
    condition: 'Foggy',
    wind: '5 km/h',
    humidity: '63%',
    aqi: 'Good',
    uvIndex: 'High',
  }

  const hourlyForecast = useMemo(
    () =>
      Array.from({ length: 24 }, (_, index) => {
        const hour = index === 0 ? '12 AM' : index < 12 ? `${index} AM` : index === 12 ? '12 PM' : `${index - 12} PM`
        const tempBase = 10 + Math.round(Math.sin(index / 3) * 2 + index * 0.08)

        return {
          hour,
          weather: index < 6 ? 'moon' : index < 18 ? 'cloud-sun' : 'cloud-rain',
          humidity: `${88 + ((index * 3) % 10)}%`,
          temp: `${tempBase}°C`,
        }
      }),
    [],
  )

  const weeklyForecast = useMemo(() => {
    const today = new Date()
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today)
      date.setDate(today.getDate() + index + 1)

      const dayName = days[date.getDay()]
      const isWeekend = date.getDay() === 0 || date.getDay() === 6

      return {
        day: dayName,
        weather: index % 3 === 0 ? 'rain' : index % 2 === 0 ? 'cloud' : 'sun',
        min: `${8 + (index % 4)}°C`,
        max: `${18 + (index % 5)}°C`,
        label: index === 0 ? 'Tomorrow' : dayName,
        isWeekend,
      }
    })
  }, [])

  const getWeatherIcon = (type: string) => {
    if (type === 'moon') return <MoonStar className="size-4 text-cyan-300/70" />
    if (type === 'cloud-rain') return <CloudRain className="size-4 text-cyan-300/70" />
    if (type === 'cloud-sun') return <Cloud className="size-4 text-cyan-300/70" />
    return <SunMedium className="size-4 text-cyan-300/70" />
  }

  return (
    <div className="h-full w-full flex flex-col gap-3 text-cyan-100">
      <div className="flex gap-1 border-b border-cyan-300/20 pb-2">
        {[
          { id: 'current', label: 'Now' },
          { id: 'hourly', label: 'Hourly forecast' },
          { id: 'weekly', label: 'Weekly forecast' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'current' | 'hourly' | 'weekly')}
            className={`flex-1 border px-2 py-1 text-[11px] font-semibold transition-colors ${
              activeTab === tab.id
                ? 'border-cyan-300/60 bg-cyan-300/10 text-cyan-100'
                : 'border-transparent bg-white/5 text-cyan-200/70 hover:bg-white/10 hover:text-cyan-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'current' && (
        <div className="space-y-2">
          <div className="border-b border-cyan-300/20 pb-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-5xl font-bold leading-none text-cyan-100">{currentWeather.temp}°C</p>
                <p className="mt-2 text-xs text-cyan-200/70">
                  {currentWeather.location}, {currentWeather.time}
                </p>
                <p className="mt-1 text-sm text-cyan-100">{currentWeather.condition}</p>
              </div>
              <Cloud className="size-10 text-cyan-300/60" />
            </div>

            <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
              <div className="space-y-1">
                <p className="text-cyan-200/60">Wind</p>
                <p className="text-cyan-100">{currentWeather.wind}</p>
              </div>
              <div className="space-y-1">
                <p className="text-cyan-200/60">Humidity</p>
                <p className="text-cyan-100">{currentWeather.humidity}</p>
              </div>
              <div className="space-y-1">
                <p className="text-cyan-200/60">AQI</p>
                <p className="text-cyan-100">{currentWeather.aqi}</p>
              </div>
              <div className="space-y-1">
                <p className="text-cyan-200/60">UV Index</p>
                <p className="text-cyan-100">{currentWeather.uvIndex}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'hourly' && (
        <div className="space-y-2">
          <div className="overflow-hidden border border-cyan-300/20">
            <div className="grid grid-cols-4 gap-2 border-b border-cyan-300/10 px-2 py-2 text-[11px] font-semibold text-cyan-200/60">
              <p>Hour</p>
              <p>Weather</p>
              <p>Humidity</p>
              <p>Temp</p>
            </div>
            <div className="px-2 py-2">
              {hourlyForecast.map((item) => (
                <div
                  key={item.hour}
                  className="grid grid-cols-4 gap-2 border-b border-cyan-300/10 px-2 py-2 text-xs text-cyan-100/80 last:border-b-0"
                >
                  <p>{item.hour}</p>
                  <div className="flex items-center">{getWeatherIcon(item.weather)}</div>
                  <p>{item.humidity}</p>
                  <p>{item.temp}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'weekly' && (
        <div className="space-y-2">
          <div className="overflow-hidden border border-cyan-300/20">
            <div className="grid grid-cols-4 gap-2 border-b border-cyan-300/10 px-2 py-2 text-[11px] font-semibold text-cyan-200/60">
              <p>Day</p>
              <p>Weather</p>
              <p>Min</p>
              <p>Max</p>
            </div>
            <div className="px-2 py-2">
              {weeklyForecast.map((item) => (
                <div
                  key={item.day}
                  className="grid grid-cols-4 gap-2 border-b border-cyan-300/10 px-2 py-2 text-xs text-cyan-100/80 last:border-b-0"
                >
                  <p>{item.label}</p>
                  <div className="flex items-center">{getWeatherIcon(item.weather)}</div>
                  <p>{item.min}</p>
                  <p>{item.max}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
