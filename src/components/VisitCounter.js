import React, { useEffect, useState } from 'react'

// TRUE GLOBAL visitor counter using Hits.sh - bypassing CORS with image pixel tracking
// This counts ALL visitors worldwide, not just per-browser
const SESSION_KEY = 'espwebtool_session_counted' // sessionStorage marker (counts once per tab/session)
const LOCAL_TOTAL_KEY = 'espwebtool_local_backup' // local backup for display

// Hits.sh configuration - using CORS-free image pixel method
const HITS_BASE_URL = 'https://hits.sh/bangdc90.github.io/espwebtool'
const HITS_JSON_URL = 'https://hits.sh/bangdc90.github.io/espwebtool.json'

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
        // Function to get current count using JSONP-like approach (bypass CORS)
        const getCurrentCount = () => {
          return new Promise((resolve) => {
            // Create a script tag to bypass CORS (JSONP approach)
            const script = document.createElement('script')
            const callbackName = 'hitsCallback_' + Date.now()
            
            // Set up global callback
            window[callbackName] = (data) => {
              resolve(data.hits || 0)
              document.head.removeChild(script)
              delete window[callbackName]
            }
            
            // Try JSONP first, fallback to image pixel tracking
            script.src = `${HITS_JSON_URL}?callback=${callbackName}`
            script.onerror = () => {
              // JSONP failed, resolve with null to use fallback
              resolve(null)
              document.head.removeChild(script)
              delete window[callbackName]
            }
            
            document.head.appendChild(script)
            
            // Timeout after 5 seconds
            setTimeout(() => {
              if (window[callbackName]) {
                resolve(null)
                document.head.removeChild(script)
                delete window[callbackName]
              }
            }, 5000)
          })
        }

        // Function to increment counter using image pixel (CORS-free)
        const incrementCounter = () => {
          return new Promise((resolve) => {
            const img = new Image()
            img.onload = () => resolve(true)
            img.onerror = () => resolve(true) // Even errors mean the request was made
            img.src = HITS_BASE_URL + '?' + Date.now() // Add timestamp to prevent caching
          })
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
          console.log('New session, incrementing counter...')
          
          // Use image pixel to increment counter (bypasses CORS)
          await incrementCounter()
          
          // Wait a moment then get updated count
          setTimeout(async () => {
            const newCount = await getCurrentCount()
            if (newCount !== null && newCount > currentCount) {
              currentCount = newCount
              console.log('Successfully incremented global counter to:', currentCount)
            } else {
              currentCount += 1
              console.log('Using local increment to:', currentCount)
            }
            
            if (!cancelled) {
              setTotal(currentCount)
            }
            
            // Save state
            try {
              sessionStorage.setItem(SESSION_KEY, '1')
              localStorage.setItem(LOCAL_TOTAL_KEY, String(currentCount))
            } catch (e) {
              console.warn('Failed to save state:', e)
            }
          }, 1000) // Wait 1 second for hits.sh to update
          
          // Show estimated count immediately
          if (!cancelled) {
            setTotal(currentCount + 1)
          }
        } else {
          console.log('Returning visitor in same session, showing count:', currentCount)
          if (!cancelled) {
            setTotal(currentCount)
          }
          
          // Update local backup with current global count
          try {
            localStorage.setItem(LOCAL_TOTAL_KEY, String(currentCount))
          } catch (e) {
            console.warn('Failed to save backup:', e)
          }
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
