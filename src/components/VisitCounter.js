import React, { useEffect, useState } from 'react'

// Global visitor counter using GitHub Repository Contents API
// This stores the counter in a JSON file in your GitHub repository
const SESSION_KEY = 'espwebtool_session_counted' // sessionStorage marker (counts once per tab/session)
const LOCAL_TOTAL_KEY = 'espwebtool_local_backup' // local backup for offline display

// GitHub configuration - using your repository to store visitor count
const GITHUB_OWNER = 'bangdc90' // Your GitHub username
const GITHUB_REPO = 'espwebtool' // Your repository name
const COUNTER_FILE_PATH = 'visitor-count.json' // File to store the count
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${COUNTER_FILE_PATH}`

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
        // First, get current count from GitHub repository file
        const fileResponse = await fetch(GITHUB_API_URL, {
          method: 'GET',
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'espwebtool-visitor-counter'
          }
        })

        let currentCount = 0
        let fileSha = null

        if (fileResponse.ok) {
          const fileData = await fileResponse.json()
          try {
            // Decode base64 content
            const content = JSON.parse(atob(fileData.content))
            currentCount = content.count || 0
            fileSha = fileData.sha
            console.log('Current global count from GitHub:', currentCount)
          } catch (parseError) {
            console.warn('Failed to parse visitor count file:', parseError)
            currentCount = 0
          }
        } else if (fileResponse.status === 404) {
          console.log('Visitor count file does not exist yet, will create it')
          currentCount = 0
        } else {
          console.log('Failed to fetch GitHub file, using local backup')
          currentCount = parseInt(localStorage.getItem(LOCAL_TOTAL_KEY) || '0', 10)
        }

        // If this session hasn't been counted, increment the global counter
        if (!sessionAlready) {
          const newCount = currentCount + 1
          
          // Update the global counter by updating the repository file
          try {
            const newContent = {
              count: newCount,
              lastUpdated: new Date().toISOString(),
              userAgent: navigator.userAgent.substring(0, 100)
            }
            
            const updatePayload = {
              message: `Update visitor count to ${newCount}`,
              content: btoa(JSON.stringify(newContent, null, 2)),
              ...(fileSha && { sha: fileSha }) // Include SHA if file exists
            }
            
            const updateResponse = await fetch(GITHUB_API_URL, {
              method: 'PUT',
              headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
                'User-Agent': 'espwebtool-visitor-counter'
              },
              body: JSON.stringify(updatePayload)
            })

            if (updateResponse.ok) {
              console.log('Successfully incremented global counter to:', newCount)
              if (!cancelled) setTotal(newCount)
              
              // Save to local backup and mark session
              try {
                localStorage.setItem(LOCAL_TOTAL_KEY, String(newCount))
                sessionStorage.setItem(SESSION_KEY, '1')
              } catch (e) {
                console.warn('Failed to save locally:', e)
              }
            } else {
              const errorData = await updateResponse.json().catch(() => ({}))
              throw new Error(`Failed to update GitHub file: ${errorData.message || updateResponse.statusText}`)
            }
          } catch (updateError) {
            console.error('Failed to update GitHub counter:', updateError)
            
            // Fallback to local increment
            const localCount = parseInt(localStorage.getItem(LOCAL_TOTAL_KEY) || '0', 10) + 1
            localStorage.setItem(LOCAL_TOTAL_KEY, String(localCount))
            sessionStorage.setItem(SESSION_KEY, '1')
            if (!cancelled) setTotal(localCount)
          }
        } else {
          // Session already counted, just display current total
          if (!cancelled) setTotal(currentCount)
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
          let localCount = parseInt(localStorage.getItem(LOCAL_TOTAL_KEY) || '0', 10)
          if (!sessionAlready) {
            localCount += 1
            localStorage.setItem(LOCAL_TOTAL_KEY, String(localCount))
            sessionStorage.setItem(SESSION_KEY, '1')
          }
          if (!cancelled) setTotal(localCount)
        } catch (localError) {
          console.error('Even local fallback failed:', localError)
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
