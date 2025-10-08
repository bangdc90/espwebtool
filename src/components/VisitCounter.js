import React, { useEffect, useState } from 'react'

// Simple local-only visitor counter (reverted)
const LOCAL_KEY = 'espwebtool_visits_local'

const VisitCounter = () => {
  const [count, setCount] = useState(() => {
    try { return parseInt(localStorage.getItem(LOCAL_KEY) || '0', 10) } catch { return 0 }
  })

  useEffect(() => {
    try {
      const v = parseInt(localStorage.getItem(LOCAL_KEY) || '0', 10) + 1
      localStorage.setItem(LOCAL_KEY, String(v))
      setCount(v)
    } catch (e) {
      // ignore
    }
  }, [])

  return (
    <div style={{ color: 'white', fontSize: '0.9rem', marginLeft: 'auto' }}>
      Total visited: {count}
    </div>
  )
}

export default VisitCounter
