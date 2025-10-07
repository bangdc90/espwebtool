import React, { useEffect, useState } from 'react'

// Global visitor counter using CountAPI as default with sessionStorage to avoid counting
// repeated navigations during the same browsing session.
// CountAPI: https://countapi.xyz/ (no-auth public counters, namespace/key)
const VISIT_KEY = 'espwebtool_visit_counted' // legacy localStorage marker
const SESSION_KEY = 'espwebtool_session_counted' // sessionStorage marker (counts once per tab/session)
const LOCAL_TOTAL_KEY = 'espwebtool_visits_total_local'

// Configure a CountAPI namespace/key. You can change these to your own namespace.
const COUNTAPI_NAMESPACE = 'espwebtool'
const COUNTAPI_KEY = 'total_visits'
const COUNTAPI_URL = `https://api.countapi.xyz/hit/${COUNTAPI_NAMESPACE}/${COUNTAPI_KEY}`

const VisitCounter = () => {
  const [total, setTotal] = useState(() => {
    try {
      const v = localStorage.getItem(LOCAL_TOTAL_KEY)
      return v ? parseInt(v, 10) : 0
    } catch (e) {
      return 0
    }
  })

  useEffect(() => {
    let cancelled = false

    const sessionAlready = (() => {
      try { return sessionStorage.getItem(SESSION_KEY) } catch (e) { return null }
    })()

    // Fetch current total (/get) so returning visitors see up-to-date count
    const fetchTotal = async () => {
      try {
        const getUrl = `https://api.countapi.xyz/get/${COUNTAPI_NAMESPACE}/${COUNTAPI_KEY}`
        const resp = await fetch(getUrl, { method: 'GET' })
        if (resp.ok) {
          const data = await resp.json()
          if (!cancelled) {
            setTotal(data.value || 0)
            try { localStorage.setItem(LOCAL_TOTAL_KEY, String(data.value || 0)) } catch (e) {}
          }
        }
      } catch (e) {
        console.error('CountAPI /get failed, using local fallback', e)
        try {
          const local = parseInt(localStorage.getItem(LOCAL_TOTAL_KEY) || '0', 10)
          if (!cancelled) setTotal(local)
        } catch (ee) {
          if (!cancelled) setTotal(0)
        }
      }
    }

    const hitIfNeeded = async () => {
      // If this session hasn't been counted, call /hit to increment
      if (!sessionAlready) {
        try {
          const resp = await fetch(COUNTAPI_URL, { method: 'GET' })
          if (resp.ok) {
            const data = await resp.json()
            if (!cancelled) {
              setTotal(data.value || 0)
              try { localStorage.setItem(LOCAL_TOTAL_KEY, String(data.value || 0)) } catch (e) {}
              try { sessionStorage.setItem(SESSION_KEY, '1') } catch (e) {}
            }
            return
          }
        } catch (e) {
          console.error('CountAPI /hit failed', e)
        }
      }
    }

    // Always fetch current total for display
    fetchTotal().then(() => {
      // Then increment only if not counted in this session
      hitIfNeeded()
    })

    return () => { cancelled = true }
  }, [])

  return (
    <div style={{ color: 'white', fontSize: '0.9rem', marginLeft: 'auto' }}>
      Total visited: {total}
    </div>
  )
}

export default VisitCounter
