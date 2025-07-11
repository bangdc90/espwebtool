import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import CircularProgress from '@mui/material/CircularProgress'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'

import styles from './FileList.module.css'

const PreBuiltFirmware = (props) => {
    const [firmwareList, setFirmwareList] = useState([])
    const [selectedFirmware, setSelectedFirmware] = useState(null)
    const [loadingStatus, setLoadingStatus] = useState('idle') // idle, loading, loaded, error
    const [firmwareBlob, setFirmwareBlob] = useState(null)
    const [manifestLoaded, setManifestLoaded] = useState(false)
    const [manifestName, setManifestName] = useState('')

    useEffect(() => {
        loadManifest()
    }, [])

    const loadManifest = async () => {
        try {
            // Add cache busting parameter
            const timestamp = new Date().getTime()
            const manifestUrl = `/firmware/manifest.json?t=${timestamp}`
            console.log('Loading manifest from:', manifestUrl)
            
            const response = await fetch(manifestUrl, {
                cache: 'no-cache',
                headers: {
                    'Cache-Control': 'no-cache'
                }
            })
            console.log('Manifest response status:', response.status)
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            const manifest = await response.json()
            console.log('Manifest loaded:', manifest)
            
            setFirmwareList(manifest.builds || [])
            setManifestName(manifest.name || 'Firmware Collection')
            setManifestLoaded(true)
            
            // Auto-select first firmware if available
            if (manifest.builds && manifest.builds.length > 0) {
                setSelectedFirmware(manifest.builds[0])
            }
        } catch (error) {
            console.error('Error loading manifest:', error)
            setManifestLoaded(false)
            
            // Try alternative path
            try {
                const timestamp = new Date().getTime()
                const altUrl = `./firmware/manifest.json?t=${timestamp}`
                console.log('Trying alternative path:', altUrl)
                
                const response = await fetch(altUrl, {
                    cache: 'no-cache',
                    headers: {
                        'Cache-Control': 'no-cache'
                    }
                })
                
                if (response.ok) {
                    const manifest = await response.json()
                    console.log('Alternative manifest loaded:', manifest)
                    setFirmwareList(manifest.builds || [])
                    setManifestName(manifest.name || 'Firmware Collection')
                    setManifestLoaded(true)
                    if (manifest.builds && manifest.builds.length > 0) {
                        setSelectedFirmware(manifest.builds[0])
                    }
                }
            } catch (altError) {
                console.error('Alternative path also failed:', altError)
            }
        }
    }

    const loadFirmware = async (firmware) => {
        if (!firmware) return
        
        setLoadingStatus('loading')
        
        try {
            const firmwarePath = `/firmware/${firmware.path}`
            console.log('Loading firmware from:', firmwarePath)
            
            const response = await fetch(firmwarePath)
            console.log('Firmware response status:', response.status)
            
            if (!response.ok) {
                // Try alternative path
                const altPath = `./firmware/${firmware.path}`
                console.log('Trying alternative firmware path:', altPath)
                const altResponse = await fetch(altPath)
                
                if (!altResponse.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                
                const blob = await altResponse.blob()
                setFirmwareBlob(blob)
                setLoadingStatus('loaded')
                
                const firmwareFile = {
                    fileName: firmware.path,
                    offset: firmware.address,
                    obj: blob,
                    firmwareInfo: firmware
                }
                
                props.setUploads([firmwareFile])
                return
            }
            
            const blob = await response.blob()
            setFirmwareBlob(blob)
            setLoadingStatus('loaded')
            
            // Update parent component with firmware data
            const firmwareFile = {
                fileName: firmware.path,
                offset: firmware.address,
                obj: blob,
                firmwareInfo: firmware
            }
            
            props.setUploads([firmwareFile])
            
        } catch (error) {
            console.error('Error loading firmware:', error)
            setLoadingStatus('error')
            props.setUploads([])
        }
    }

    const handleFirmwareSelect = (firmware) => {
        setSelectedFirmware(firmware)
        setLoadingStatus('idle')
        setFirmwareBlob(null)
        props.setUploads([])
    }

    const getStatusIcon = () => {
        switch (loadingStatus) {
            case 'loading':
                return <CircularProgress size={20} />
            case 'loaded':
                return <CheckCircleIcon color="success" />
            case 'error':
                return <ErrorIcon color="error" />
            default:
                return <CloudDownloadIcon />
        }
    }

    const getStatusText = () => {
        switch (loadingStatus) {
            case 'loading':
                return 'Loading firmware...'
            case 'loaded':
                return `Firmware loaded (${(firmwareBlob?.size || 0)} bytes)`
            case 'error':
                return 'Error loading firmware'
            default:
                return 'Ready to load firmware'
        }
    }

    const getChipColor = (chipFamily) => {
        switch (chipFamily) {
            case 'ESP32':
                return 'primary'
            case 'ESP8266':
                return 'secondary'
            case 'ESP32C3':
                return 'success'
            case 'ESP32S2':
                return 'warning'
            case 'ESP32S3':
                return 'info'
            default:
                return 'default'
        }
    }

    const formatAddress = (address) => {
        return `0x${address.toString(16).toUpperCase()}`
    }

    if (!manifestLoaded) {
        return (
            <Box textAlign='center' className={styles.box}>
                <Alert severity="error">
                    Failed to load firmware manifest. Please check if manifest.json exists in the firmware directory.
                </Alert>
            </Box>
        )
    }

    if (firmwareList.length === 0) {
        return (
            <Box textAlign='center' className={styles.box}>
                <Alert severity="info">
                    No firmware available. Please add firmware files and update the manifest.json.
                </Alert>
            </Box>
        )
    }

    return (
        <Box textAlign='center' className={styles.box}>
            <Typography variant="h6" component="h2" gutterBottom>
                {manifestName}
            </Typography>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="body2" color="text.secondary">
                    Select firmware to flash
                </Typography>
                <Button 
                    size="small" 
                    onClick={loadManifest}
                    variant="outlined"
                >
                    Reload Manifest
                </Button>
            </Box>
            
            <Grid container spacing={2}>
                {firmwareList.map((firmware, index) => (
                    <Grid item xs={12} md={6} key={`${firmware.chipFamily}-${firmware.version}-${index}`}>
                        <Card 
                            variant="outlined" 
                            sx={{ 
                                cursor: 'pointer',
                                border: selectedFirmware === firmware ? 2 : 1,
                                borderColor: selectedFirmware === firmware ? 'primary.main' : 'divider'
                            }}
                            onClick={() => handleFirmwareSelect(firmware)}
                        >
                            <CardContent>
                                <Box display="flex" alignItems="center" gap={1} mb={1}>
                                    {selectedFirmware === firmware ? 
                                        <RadioButtonCheckedIcon color="primary" /> : 
                                        <RadioButtonUncheckedIcon />
                                    }
                                    <Typography variant="h6" component="h3">
                                        {firmware.chipFamily} v{firmware.version}
                                    </Typography>
                                </Box>
                                
                                <Box display="flex" gap={1} mb={1}>
                                    <Chip 
                                        label={firmware.chipFamily} 
                                        color={getChipColor(firmware.chipFamily)}
                                        size="small"
                                    />
                                    <Chip 
                                        label={`v${firmware.version}`} 
                                        variant="outlined"
                                        size="small"
                                    />
                                </Box>
                                
                                <Grid container spacing={1}>
                                    <Grid item xs={6}>
                                        <Typography variant="caption" color="text.secondary">
                                            Address: {formatAddress(firmware.address)}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="caption" color="text.secondary">
                                            File: {firmware.path}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            
            {selectedFirmware && (
                <Card variant="outlined" sx={{ mt: 2, maxWidth: 600, margin: '16px auto' }}>
                    <CardContent>
                        <Typography variant="h6" component="h2" gutterBottom>
                            Selected: {selectedFirmware.chipFamily} v{selectedFirmware.version}
                        </Typography>
                        
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                            {getStatusIcon()}
                            <Typography variant="body2" color="text.secondary">
                                {getStatusText()}
                            </Typography>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" mb={1}>
                            Address: {formatAddress(selectedFirmware.address)} | File: {selectedFirmware.path}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary">
                            Firmware for {selectedFirmware.chipFamily} chip family
                        </Typography>
                    </CardContent>
                    
                    <CardActions>
                        <Button 
                            variant="contained"
                            onClick={() => loadFirmware(selectedFirmware)}
                            disabled={loadingStatus === 'loading'}
                            startIcon={<CloudDownloadIcon />}
                        >
                            {loadingStatus === 'loaded' ? 'Reload' : 'Load'} Firmware
                        </Button>
                    </CardActions>
                </Card>
            )}
        </Box>
    )
}

PreBuiltFirmware.propTypes = {
    setUploads: PropTypes.func.isRequired,
    chipName: PropTypes.string,
}

export default PreBuiltFirmware
