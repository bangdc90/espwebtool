import React, { useState } from 'react'
import { Box, Button, Typography, Alert } from '@mui/material'

const DebugManifest = () => {
    const [debugInfo, setDebugInfo] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const testManifest = async () => {
        setIsLoading(true)
        setDebugInfo('')
        
        const paths = [
            '/firmware/manifest.json',
            './firmware/manifest.json',
            'firmware/manifest.json',
            '/espwebtool/firmware/manifest.json'
        ]
        
        let results = []
        
        for (const path of paths) {
            try {
                const response = await fetch(path)
                results.push(`${path}: ${response.status} ${response.statusText}`)
                
                if (response.ok) {
                    const text = await response.text()
                    results.push(`  Content length: ${text.length}`)
                    results.push(`  First 100 chars: ${text.substring(0, 100)}...`)
                }
            } catch (error) {
                results.push(`${path}: Error - ${error.message}`)
            }
        }
        
        setDebugInfo(results.join('\n'))
        setIsLoading(false)
    }

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                Debug Manifest Loading
            </Typography>
            
            <Button 
                variant="contained" 
                onClick={testManifest}
                disabled={isLoading}
                sx={{ mb: 2 }}
            >
                {isLoading ? 'Testing...' : 'Test Manifest Paths'}
            </Button>
            
            {debugInfo && (
                <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                        {debugInfo}
                    </Typography>
                </Alert>
            )}
        </Box>
    )
}

export default DebugManifest
