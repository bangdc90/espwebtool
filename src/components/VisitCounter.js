import React, { useEffect, useState } from 'react'

// TRUE GLOBAL visitor counter using Hits.sh - a free public hit counter service
// This counts ALL visitors worldwide, not just per-browser
const SESSION_KEY = 'espwebtool_session_counted' // sessionStorage marker (counts once per tab/session)
const LOCAL_TOTAL_KEY = 'espwebtool_local_backup' // local backup for display

// Hits.sh - Free, reliable global counter service (no signup required)
const HITS_API_URL = 'https://hits.sh/bangdc90.github.io/espwebtool'

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

    // Check if this session has already been counted
    const sessionAlready = (() => {
      try { 
        return sessionStorage.getItem(SESSION_KEY) 
      } catch (e) { 
        return null 
      }
    })()

    const initializeCounter = async () => {
      try {
        // Always get current global count first
        const getCurrentCount = async () => {
          try {
            const response = await fetch(HITS_API_URL + '.json', {
              method: 'GET',
              headers: {
                'Accept': 'application/json'
              }
            })
            
            if (response.ok) {
              const data = await response.json()
              return data.hits || 0
            }
          } catch (e) {
            console.log('Failed to get current count:', e)
          }
          return null
        }

        // Get current global count
        let currentCount = await getCurrentCount()
        
        if (currentCount !== null) {
          console.log('Current global count from Hits.sh:', currentCount)
        } else {
          // Fallback to local backup
          currentCount = parseInt(localStorage.getItem(LOCAL_TOTAL_KEY) || '0', 10)
          console.log('Using local backup count:', currentCount)
        }

        // If this session hasn't been counted, increment the global counter
        if (!sessionAlready) {
          try {
            // Hit the counter endpoint to increment
            const incrementResponse = await fetch(HITS_API_URL, {
              method: 'GET',
              headers: {
                'User-Agent': 'espwebtool-visitor-counter'
              }
            })

            if (incrementResponse.ok) {
              // Get the updated count
              const newCount = await getCurrentCount()
              if (newCount !== null) {
                currentCount = newCount
                console.log('Successfully incremented global counter to:', currentCount)
              } else {
                currentCount += 1
                console.log('Incremented locally to:', currentCount)
              }
              
              // Mark this session as counted
              try {
                sessionStorage.setItem(SESSION_KEY, '1')
                localStorage.setItem(LOCAL_TOTAL_KEY, String(currentCount))
              } catch (e) {
                console.warn('Failed to mark session:', e)
              }
            } else {
              throw new Error('Failed to increment global counter')
            }
          } catch (incrementError) {
            console.error('Failed to increment global counter:', incrementError)
            
            // Fallback to local increment
            currentCount += 1
            try {
              sessionStorage.setItem(SESSION_KEY, '1')
              localStorage.setItem(LOCAL_TOTAL_KEY, String(currentCount))
            } catch (e) {
              console.warn('Failed to save locally:', e)
            }
          }
        } else {
          console.log('Returning visitor in same session, showing count:', currentCount)
          // Update local backup with current global count
          try {
            localStorage.setItem(LOCAL_TOTAL_KEY, String(currentCount))
          } catch (e) {
            console.warn('Failed to save backup:', e)
          }
        }

        if (!cancelled) {
          setTotal(currentCount)
        }

      } catch (error) {
        console.error('Counter initialization failed:', error)
        
        // Ultimate fallback to local counter
        try {
          let fallbackCount = parseInt(localStorage.getItem(LOCAL_TOTAL_KEY) || '1', 10)
          if (!sessionAlready) {
            fallbackCount += 1
            localStorage.setItem(LOCAL_TOTAL_KEY, String(fallbackCount))
            sessionStorage.setItem(SESSION_KEY, '1')
          }
          if (!cancelled) setTotal(fallbackCount)
        } catch (localError) {
          console.error('All fallbacks failed:', localError)
          if (!cancelled) setTotal(1)
        }
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
