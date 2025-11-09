import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import Alert from '@mui/material/Alert'
import Link from '@mui/material/Link'
import YouTubeIcon from '@mui/icons-material/YouTube'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'

import BuyKeyDialog from './BuyKeyDialog'
import styles from './FileList.module.css'

const PreBuiltFirmware = (props) => {
    const [firmwareList, setFirmwareList] = useState([])
    const [selectedFirmware, setSelectedFirmware] = useState(null)
    const [loadingStatus, setLoadingStatus] = useState('idle') // idle, loading, loaded, error
    const [firmwareBlob, setFirmwareBlob] = useState(null)
    const [manifestLoaded, setManifestLoaded] = useState(false)
    const [manifestName, setManifestName] = useState('')
    const [keyInput, setKeyInput] = useState('')
    const [keyActivated, setKeyActivated] = useState(false)
    const [buyKeyDialogOpen, setBuyKeyDialogOpen] = useState(false)
    const [keyVerifying, setKeyVerifying] = useState(false)

    useEffect(() => {
        loadManifest()
    }, [])

    const loadManifest = async () => {
        try {
            const timestamp = new Date().getTime()
            // Try process.env.PUBLIC_URL for development and production
            const baseUrl = process.env.PUBLIC_URL || ''
            const manifestUrl = `${baseUrl}/firmware/manifest.json?t=${timestamp}`
            
            const response = await fetch(manifestUrl, {
                cache: 'no-cache',
                headers: {
                    'Cache-Control': 'no-cache'
                }
            })
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            const manifest = await response.json()
            
            setFirmwareList(manifest.builds || [])
            setManifestName(manifest.name || 'Firmware Collection')
            setManifestLoaded(true)
            
            // Auto-select and load first firmware if available
            if (manifest.builds && manifest.builds.length > 0) {
                const firstFirmware = manifest.builds[0]
                setSelectedFirmware(firstFirmware)
                
                // Notify parent component about firmware selection
                if (props.setSelectedFirmwareInfo) {
                    props.setSelectedFirmwareInfo(firstFirmware)
                }
                
                // Tự động load firmware đầu tiên
                loadFirmware(firstFirmware)
            }
        } catch (error) {
            console.error('Error loading manifest:', error)
            setManifestLoaded(false)
            
            // Try alternative paths
            const paths = ['./firmware/manifest.json', '/firmware/manifest.json']
            
            for (const path of paths) {
                try {
                    const timestamp = new Date().getTime()
                    const altUrl = `${path}?t=${timestamp}`
                    
                    const response = await fetch(altUrl, {
                        cache: 'no-cache',
                        headers: {
                            'Cache-Control': 'no-cache'
                        }
                    })
                    
                    if (response.ok) {
                        const manifest = await response.json()
                        setFirmwareList(manifest.builds || [])
                        setManifestName(manifest.name || 'Firmware Collection')
                        setManifestLoaded(true)
                        if (manifest.builds && manifest.builds.length > 0) {
                            const firstFirmware = manifest.builds[0]
                            setSelectedFirmware(firstFirmware)
                            
                            // Notify parent component about firmware selection
                            if (props.setSelectedFirmwareInfo) {
                                props.setSelectedFirmwareInfo(firstFirmware)
                            }
                            
                            // Tự động load firmware đầu tiên
                            loadFirmware(firstFirmware)
                        }
                        return
                    }
                } catch (altError) {
                    console.error(`Failed to load from ${path}:`, altError)
                }
            }
        }
    }

    const loadFirmware = async (firmware) => {
        if (!firmware) return
        
        setLoadingStatus('loading')
        
        try {
            // Try process.env.PUBLIC_URL for development and production
            const baseUrl = process.env.PUBLIC_URL || ''
            const firmwarePath = `${baseUrl}/firmware/${firmware.path}`
            const partitionsPath = `${baseUrl}/firmware/partitions.bin`

            console.log('Loading firmware from:', firmwarePath)

            // Check if file is ZIP
            const isZipFile = firmware.path.toLowerCase().endsWith('.zip')

            // Fetch firmware file with timeout
            const firmwareResponse = await fetch(firmwarePath, {
                cache: 'no-cache'
            })
            
            if (!firmwareResponse.ok) {
                throw new Error(`HTTP error! status: ${firmwareResponse.status}`)
            }
            
            let firmwareBlob
            
            // If ZIP file, extract it
            if (isZipFile) {
                console.log('Detected ZIP file, extracting...')
                const zipBlob = await firmwareResponse.blob()
                console.log('ZIP file loaded:', zipBlob.size, 'bytes')
                
                // Load JSZip from window (loaded from CDN)
                if (!window.JSZip) {
                    throw new Error('JSZip library not loaded')
                }
                
                const zip = new window.JSZip()
                const zipContent = await zip.loadAsync(zipBlob)
                
                // Find the .bin file inside ZIP
                const binFiles = Object.keys(zipContent.files).filter(name => 
                    name.toLowerCase().endsWith('.bin') && !zipContent.files[name].dir
                )
                
                if (binFiles.length === 0) {
                    throw new Error('No .bin file found in ZIP')
                }
                
                // Extract first .bin file
                const binFileName = binFiles[0]
                console.log('Extracting:', binFileName)
                
                const binData = await zipContent.files[binFileName].async('arraybuffer')
                firmwareBlob = new Blob([binData])
                console.log('Firmware extracted:', firmwareBlob.size, 'bytes')
            } else {
                // Regular .bin file
                firmwareBlob = await firmwareResponse.blob()
                console.log('Firmware loaded:', firmwareBlob.size, 'bytes')
            }

            setFirmwareBlob(firmwareBlob)

            // If firmware.address is 0 (number) or '0' (string), only load firmware
            const addressIsZero = firmware.address === 0 || firmware.address === '0' || firmware.address === '0x0' || firmware.address === 0x0

            if (addressIsZero) {
                const firmwareFileOnly = {
                    fileName: firmware.path,
                    offset: firmware.address,
                    obj: firmwareBlob,
                    firmwareInfo: firmware
                }

                setLoadingStatus('loaded')
                props.setUploads([firmwareFileOnly])
                return
            }

            // Otherwise fetch partitions and queue both files
            const partitionsResponse = await fetch(partitionsPath)
            if (!partitionsResponse.ok) {
                throw new Error(`HTTP error! status: ${partitionsResponse.status}`)
            }
            const partitionsBlob = await partitionsResponse.blob()

            setLoadingStatus('loaded')

            // Create file entries for both partitions and firmware
            const partitionsFile = {
                fileName: 'partitions.bin',
                offset: '8000', // Flash partition table at 0x8000
                obj: partitionsBlob,
                firmwareInfo: { title: 'Partition Table' }
            }

            const firmwareFile = {
                fileName: firmware.path,
                offset: firmware.address,
                obj: firmwareBlob,
                firmwareInfo: firmware
            }

            // Set both files to be uploaded in the correct order
            props.setUploads([partitionsFile, firmwareFile])

        } catch (error) {
            console.error('Error loading firmware:', error)
            
            // Try alternative paths
            try {
                const uploads = []
                let firmwareBlob = null

                // Determine if we should skip partitions based on address
                const addressIsZero = firmware.address === 0 || firmware.address === '0' || firmware.address === '0x0' || firmware.address === 0x0
                
                // Check if file is ZIP
                const isZipFile = firmware.path.toLowerCase().endsWith('.zip')

                // If address is zero, only try to load firmware
                if (addressIsZero) {
                    const firmwarePaths = [`./firmware/${firmware.path}`, `/firmware/${firmware.path}`]
                    let firmwareLoaded = false

                    for (const path of firmwarePaths) {
                        try {
                            const firmwareResponse = await fetch(path)
                            if (firmwareResponse.ok) {
                                let blob
                                
                                // Extract ZIP if needed
                                if (isZipFile) {
                                    const zipBlob = await firmwareResponse.blob()
                                    const zip = new window.JSZip()
                                    const zipContent = await zip.loadAsync(zipBlob)
                                    const binFiles = Object.keys(zipContent.files).filter(name => 
                                        name.toLowerCase().endsWith('.bin') && !zipContent.files[name].dir
                                    )
                                    if (binFiles.length > 0) {
                                        const binData = await zipContent.files[binFiles[0]].async('arraybuffer')
                                        blob = new Blob([binData])
                                    }
                                } else {
                                    blob = await firmwareResponse.blob()
                                }
                                
                                if (blob) {
                                    firmwareBlob = blob
                                    uploads.push({
                                        fileName: firmware.path,
                                        offset: firmware.address,
                                        obj: firmwareBlob,
                                        firmwareInfo: firmware
                                    })
                                    firmwareLoaded = true
                                    setFirmwareBlob(firmwareBlob)
                                    break
                                }
                            }
                        } catch (firmwareError) {
                            console.error(`Failed to load firmware from ${path}:`, firmwareError)
                        }
                    }

                    if (!firmwareLoaded) {
                        throw new Error(`Failed to load firmware ${firmware.path}`)
                    }

                    setLoadingStatus('loaded')
                    props.setUploads(uploads)
                    return
                }

                // Otherwise try to load partitions first
                const partitionsPaths = [`./firmware/partitions.bin`, `/firmware/partitions.bin`]
                let partitionsLoaded = false

                for (const path of partitionsPaths) {
                    try {
                        const partitionsResponse = await fetch(path)
                        if (partitionsResponse.ok) {
                            const partitionsBlob = await partitionsResponse.blob()
                            uploads.push({
                                fileName: 'partitions.bin',
                                offset: '8000', // Flash partition table at 0x8000
                                obj: partitionsBlob,
                                firmwareInfo: { title: 'Partition Table' }
                            })
                            partitionsLoaded = true
                            break
                        }
                    } catch (partitionsError) {
                        console.error(`Failed to load partitions from ${path}:`, partitionsError)
                    }
                }

                if (!partitionsLoaded) {
                    throw new Error('Failed to load partitions.bin')
                }

                // Try to load firmware
                const firmwarePaths = [`./firmware/${firmware.path}`, `/firmware/${firmware.path}`]
                let firmwareLoaded = false

                for (const path of firmwarePaths) {
                    try {
                        const firmwareResponse = await fetch(path)
                        if (firmwareResponse.ok) {
                            let blob
                            
                            // Extract ZIP if needed
                            if (isZipFile) {
                                const zipBlob = await firmwareResponse.blob()
                                const zip = new window.JSZip()
                                const zipContent = await zip.loadAsync(zipBlob)
                                const binFiles = Object.keys(zipContent.files).filter(name => 
                                    name.toLowerCase().endsWith('.bin') && !zipContent.files[name].dir
                                )
                                if (binFiles.length > 0) {
                                    const binData = await zipContent.files[binFiles[0]].async('arraybuffer')
                                    blob = new Blob([binData])
                                }
                            } else {
                                blob = await firmwareResponse.blob()
                            }
                            
                            if (blob) {
                                firmwareBlob = blob
                                uploads.push({
                                    fileName: firmware.path,
                                    offset: firmware.address,
                                    obj: firmwareBlob,
                                    firmwareInfo: firmware
                                })
                                firmwareLoaded = true
                                setFirmwareBlob(firmwareBlob)
                                break
                            }
                        }
                    } catch (firmwareError) {
                        console.error(`Failed to load firmware from ${path}:`, firmwareError)
                    }
                }

                if (!firmwareLoaded) {
                    throw new Error(`Failed to load firmware ${firmware.path}`)
                }

                // If both files loaded successfully
                if (uploads.length === 2) {
                    setLoadingStatus('loaded')
                    props.setUploads(uploads)
                    return
                }
                
            } catch (altError) {
                console.error('Error in alternative loading paths:', altError)
            }
            
            setLoadingStatus('error')
            props.setUploads([])
        }
    }

    const handleFirmwareSelect = (firmware) => {
        setSelectedFirmware(firmware)
        // Reset key activation status when switching firmware
        setKeyActivated(false)
        setKeyInput('')
        // Notify parent component about firmware selection
        if (props.setSelectedFirmwareInfo) {
            props.setSelectedFirmwareInfo(firmware)
        }
        if (props.setKeyActivated) {
            props.setKeyActivated(false)
        }
        // Tự động load firmware ngay khi chọn
        loadFirmware(firmware)
    }

    const verifyKey = async (key) => {
        try {
            setKeyVerifying(true)
            const response = await fetch(`https://keymanager.congbang2709.workers.dev/verifyKey?key=${encodeURIComponent(key)}`, {
                method: 'GET',
                cache: 'no-cache'
            })
            
            const result = await response.json()
            setKeyVerifying(false)
            
            if (result.status === 'OK') {
                return true
            }
            return false
        } catch (error) {
            setKeyVerifying(false)
            return false
        }
    }

    const handleActivateKey = async () => {
        if (!keyInput.trim()) {
            alert('Vui lòng nhập key')
            return
        }

        const isValid = await verifyKey(keyInput.trim())
        
        if (isValid) {
            setKeyActivated(true)
            // Notify parent component
            if (props.setKeyActivated) {
                props.setKeyActivated(true)
            }
            alert('Đã kích hoạt key (Mỗi Key chỉ được flash duy nhất 1 lần, không thể tái sử dụng, cân nhắc trước khi nạp)\n\nVui lòng bấm Nạp Chương Trình để nạp')
        } else {
            alert('Key không hợp lệ hoặc đã được sử dụng')
        }
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
                return null
        }
    }

    const getStatusText = () => {
        switch (loadingStatus) {
            case 'loading':
                return 'Đang tải firmware...'
            case 'loaded':
                return `Firmware đã sẵn sàng (${(firmwareBlob?.size || 0)} bytes). Nhấn "NẠP CHƯƠNG TRÌNH" để flash.`
            case 'error':
                return 'Lỗi khi tải firmware.\nTải lại sau vài phút, do lưu lượng truy cập hiện tại cao.'
            default:
                return 'Sẵn sàng tải firmware'
        }
    }

    const formatAddress = (address) => {
        // If address is string (hex), add 0x prefix
        if (typeof address === 'string') {
            return `0x${address.toUpperCase()}`
        }
        // If address is number, convert to hex
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
            <Typography variant="body2" color="text.secondary" gutterBottom>
                Select firmware to flash
            </Typography>
            
            <Grid container spacing={2}>
                {firmwareList.map((firmware, index) => (
                    <Grid item xs={12} sm={6} md={4} key={`${firmware.title || firmware.chipFamily}-${index}`}>
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
                                    <Typography variant="h6" component="h3" fontWeight="bold">
                                        {firmware.title}
                                    </Typography>
                                </Box>
                                
                                <Typography 
                                    variant="body2" 
                                    color="text.secondary" 
                                    mb={1} 
                                    sx={{ 
                                        whiteSpace: 'pre-line',
                                        wordBreak: 'break-word',
                                        overflowWrap: 'break-word',
                                        textAlign: 'left'
                                    }}
                                >
                                    {firmware.description}
                                </Typography>
                                {firmware.youtube && (
                                    <Box mt={1}>
                                        <Link href={firmware.youtube} target="_blank" rel="noopener noreferrer" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                                            <YouTubeIcon color="error" />
                                            <span>Watch on YouTube</span>
                                        </Link>
                                    </Box>
                                )}
                                
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
                        <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
                            {selectedFirmware.title}
                        </Typography>
                        
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                            {getStatusIcon()}
                            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line', textAlign: 'left' }}>
                                {getStatusText()}
                            </Typography>
                            {/* Reload button - only show when error */}
                            {loadingStatus === 'error' && (
                                <Button
                                    variant="contained"
                                    color="success"
                                    size="small"
                                    onClick={() => loadFirmware(selectedFirmware)}
                                    sx={{ ml: 'auto', minWidth: '80px' }}
                                >
                                    Tải Lại
                                </Button>
                            )}
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" mb={1}>
                            Address: {formatAddress(selectedFirmware.address)} | File: {selectedFirmware.path}
                        </Typography>
                        
                        <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ 
                                whiteSpace: 'pre-line',
                                wordBreak: 'break-word',
                                overflowWrap: 'break-word',
                                textAlign: 'left'
                            }}
                        >
                            {selectedFirmware.description}
                        </Typography>
                        {selectedFirmware.youtube && (
                            <Box mt={1}>
                                <Link href={selectedFirmware.youtube} target="_blank" rel="noopener noreferrer" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                                    <YouTubeIcon color="error" />
                                    <span>Watch on YouTube</span>
                                </Link>
                            </Box>
                        )}
                        
                        {/* Key activation section for paid firmware */}
                        {selectedFirmware.requireKey && (
                            <Box mt={3} p={2} sx={{ bgcolor: 'rgba(255, 193, 7, 0.1)', borderRadius: 1 }}>
                                <Box display="flex" alignItems="center" gap={1} mb={2}>
                                    {keyActivated ? <LockOpenIcon color="success" /> : <LockIcon color="warning" />}
                                    <Typography variant="body2" fontWeight="bold" color={keyActivated ? 'success.main' : 'warning.main'}>
                                        {keyActivated ? 'Key đã được kích hoạt' : 'Firmware này cần key để nạp'}
                                    </Typography>
                                </Box>
                                
                                {loadingStatus === 'error' && (
                                    <Alert severity="error" sx={{ mb: 2 }}>
                                        Firmware chưa tải được. Vui lòng bấm &quot;Tải Lại&quot; ở trên trước khi nhập key.<br />
                                        Tải lại sau vài phút, do lưu lượng truy cập hiện tại cao.
                                    </Alert>
                                )}
                                
                                {!keyActivated && (
                                    <Box display="flex" gap={1} alignItems="center">
                                        <TextField
                                            size="small"
                                            placeholder="Nhập key..."
                                            value={keyInput}
                                            onChange={(e) => setKeyInput(e.target.value)}
                                            disabled={keyVerifying || loadingStatus !== 'loaded'}
                                            fullWidth
                                        />
                                        <Button
                                            variant="contained"
                                            onClick={handleActivateKey}
                                            disabled={keyVerifying || !keyInput.trim() || loadingStatus !== 'loaded'}
                                            sx={{ minWidth: '120px' }}
                                        >
                                            {keyVerifying ? <CircularProgress size={20} /> : 'Kích hoạt'}
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        )}
                    </CardContent>
                </Card>
            )}
            
            {/* Buy Key Dialog */}
            <BuyKeyDialog 
                open={buyKeyDialogOpen}
                onClose={() => setBuyKeyDialogOpen(false)}
            />
        </Box>
    )
}

PreBuiltFirmware.propTypes = {
    setUploads: PropTypes.func.isRequired,
    chipName: PropTypes.string,
    setSelectedFirmwareInfo: PropTypes.func,
    setKeyActivated: PropTypes.func,
}

export default PreBuiltFirmware
