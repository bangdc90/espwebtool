import React, { useEffect, useState } from 'react'

// Global visitor counter using CountAPI as default with sessionStorage to avoid counting
// repeated navigations during the same browsing session.
// CountAPI: https://countapi.xyz/ (no-auth public counters, namespace/key)
const SESSION_KEY = 'espwebtool_session_counted' // sessionStorage marker (counts once per tab/session)
const LOCAL_TOTAL_KEY = 'espwebtool_visits_total_local'

// Configure counter service. Using a more reliable approach with localStorage + simulated global counter
const COUNTAPI_NAMESPACE = 'espwebtool'
const COUNTAPI_KEY = 'total_visits'
const COUNTAPI_HIT_URL = `https://api.countapi.xyz/hit/${COUNTAPI_NAMESPACE}/${COUNTAPI_KEY}`
const COUNTAPI_GET_URL = `https://api.countapi.xyz/get/${COUNTAPI_NAMESPACE}/${COUNTAPI_KEY}`

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

    const incrementLocalCount = () => {
      try {
        const current = parseInt(localStorage.getItem(LOCAL_TOTAL_KEY) || '0', 10)
        const next = current + 1
        localStorage.setItem(LOCAL_TOTAL_KEY, String(next))
        return next
      } catch (e) {
        console.warn('Failed to increment local count:', e)
        return 1
      }
    }

    const getLocalCount = () => {
      try {
        return parseInt(localStorage.getItem(LOCAL_TOTAL_KEY) || '0', 10)
      } catch (e) {
        return 0
      }
    }

    // Try CountAPI first, fallback to local counter
    const initializeCounter = async () => {
      let countFromAPI = null
      
      // Try to get current count from CountAPI
      try {
        const getResp = await fetch(COUNTAPI_GET_URL, { 
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        })
        if (getResp.ok) {
          const getData = await getResp.json()
          countFromAPI = getData.value || 0
          console.log('CountAPI current count:', countFromAPI)
        }
      } catch (e) {
        console.log('CountAPI get failed:', e.message)
      }

      // If this session hasn't been counted yet
      if (!sessionAlready) {
        let newCount = null
        
        // Try to increment via CountAPI
        try {
          const hitResp = await fetch(COUNTAPI_HIT_URL, { 
            method: 'GET',
            headers: { 'Accept': 'application/json' }
          })
          if (hitResp.ok) {
            const hitData = await hitResp.json()
            newCount = hitData.value || 0
            console.log('CountAPI incremented to:', newCount)
            
            try {
              sessionStorage.setItem(SESSION_KEY, '1')
              localStorage.setItem(LOCAL_TOTAL_KEY, String(newCount))
            } catch (e) {
              console.warn('Failed to mark session/save count:', e)
            }
          }
        } catch (e) {
          console.log('CountAPI hit failed:', e.message)
        }

        // If CountAPI failed, use local counter
        if (newCount === null) {
          console.log('Using local counter fallback')
          newCount = incrementLocalCount()
          try {
            sessionStorage.setItem(SESSION_KEY, '1')
          } catch (e) {
            console.warn('Failed to mark session:', e)
          }
        }

        if (!cancelled) setTotal(newCount)
      } else {
        // Session already counted, just display current total
        const displayCount = countFromAPI !== null ? countFromAPI : getLocalCount()
        if (!cancelled) setTotal(displayCount)
      }
    }

    initializeCounter()

    return () => { cancelled = true }
  }, [])

  return (
    <div style={{ color: 'white', fontSize: '0.9rem', marginLeft: 'auto' }}>
      Total visited: {total}
    </div>
  )
}

export default VisitCounter
