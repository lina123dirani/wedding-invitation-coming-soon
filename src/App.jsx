import { useEffect, useState } from 'react'

// Next Sunday after Sunday, October 11, 2026, at 10:00 local time.
const LAUNCH_AT = new Date(2026, 9, 18, 10, 0, 0)

const UNITS = [
  ['days', 'Days'],
  ['hours', 'Hours'],
  ['minutes', 'Minutes'],
  ['seconds', 'Seconds'],
]

function getRemaining(target) {
  const diff = target.getTime() - Date.now()
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true }
  }

  const total = Math.floor(diff / 1000)
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    done: false,
  }
}

function useCountdown(target) {
  const [time, setTime] = useState(() => getRemaining(target))

  useEffect(() => {
    const id = setInterval(() => {
      const next = getRemaining(target)
      setTime(next)
      if (next.done) clearInterval(id)
    }, 1000)

    return () => clearInterval(id)
  }, [target])

  return time
}

function plural(count, word) {
  return `${count} ${word}${count === 1 ? '' : 's'}`
}

function TimeUnit({ value, label }) {
  const text = String(value).padStart(2, '0')

  return (
    <div className="unit">
      <div className="digit-window">
        <span className="digit" key={text}>
          {text}
        </span>
      </div>
      <span className="unit-label">{label}</span>
    </div>
  )
}

function App() {
  const time = useCountdown(LAUNCH_AT)
  const launchDate = new Intl.DateTimeFormat('en', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(LAUNCH_AT)
  const launchClock = new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(LAUNCH_AT)

  const timerLabel = time.done
    ? 'The collection is open'
    : `${plural(time.days, 'day')}, ${plural(time.hours, 'hour')}, and ${plural(time.minutes, 'minute')} until launch`

  return (
    <main className="stage">
      <div className="wash" aria-hidden="true" />
      <div className="petals" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <article className="card">
        <p className="eyebrow">Invitations</p>
        <img
          className="logo"
          src="/logo.png"
          width="592"
          height="756"
          alt="Thread & Vow Studio logo: an open envelope with a burgundy monogram, florals, and a wax seal"
        />
        <div className="rule" aria-hidden="true" />
        <h1>Coming soon</h1>
        <p className="lede">
          {time.done
            ? 'The collection is open.'
            : 'Invitations, finished by hand and sealed in wax.'}
        </p>

        <div className="countdown" role="timer" aria-label={timerLabel}>
          {UNITS.map(([key, label]) => (
            <TimeUnit key={key} value={time[key]} label={label} />
          ))}
        </div>

        <p className="when">
          {time.done ? 'Opened' : 'Opens'} {launchDate}
          <span className="when-clock">{launchClock}</span>
        </p>
      </article>
    </main>
  )
}

export default App
