import React, { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import useMediaQuery from '@mui/material/useMediaQuery'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import RefreshIcon from '@mui/icons-material/Refresh'

import PropTypes from 'prop-types'
import TabBar from './TabBar'
import FirmwareCard from './FirmwareCard'
import FirmwareModal from './FirmwareModal'

const FirmwareGrid = ({ onStartFlash, extraTabs = [], onActiveTabChange, mobileDefaultTabId = null, defaultTabId = null }) => {
  const isMobile = useMediaQuery('(max-width:599px)')
  const [firmwareList, setFirmwareList] = useState([])
  const [manifestLoaded, setManifestLoaded] = useState(false)
  const [manifestError, setManifestError] = useState(false)
  const [activeTab, setActiveTab] = useState(null)
  const [selectedFirmware, setSelectedFirmware] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [loadingStatus, setLoadingStatus] = useState('idle') // idle | loading | loaded | error
  const [uploads, setUploads] = useState([])

  // Prevent stale closure on firmware load
  const loadingRef = useRef(false)

  useEffect(() => {
    loadManifest()
  }, [])

  const loadManifest = async () => {
    setManifestError(false)
    try {
      const ts = Date.now()
      const baseUrl = process.env.PUBLIC_URL || ''
      const res = await fetch(`${baseUrl}/firmware/manifest.json?t=${ts}`, {
        cache: 'no-cache',
        headers: { 'Cache-Control': 'no-cache' },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const manifest = await res.json()
      initList(manifest.builds || [])
    } catch (e) {
      // Try fallback paths
      for (const path of ['./firmware/manifest.json', '/firmware/manifest.json']) {
        try {
          const res = await fetch(`${path}?t=${Date.now()}`, { cache: 'no-cache' })
          if (res.ok) {
            const manifest = await res.json()
            initList(manifest.builds || [])
            return
          }
        } catch (err) {
          console.warn(`Manifest fallback ${path} failed:`, err)
        }      }
      console.error('Manifest load failed', e)
      setManifestError(true)
    }
  }

  const initList = (builds) => {
    setFirmwareList(builds)
    setManifestLoaded(true)
    // Derive tabs from manifest order (dedup, preserve order)
    const seen = new Set()
    const tabs = []
    builds.forEach((b) => {
      const tabId = b.tab || 'Other'
      if (!seen.has(tabId)) {
        seen.add(tabId)
        tabs.push(tabId)
      }
    })
    const preferredId = defaultTabId || (isMobile ? mobileDefaultTabId : null)
    setActiveTab(preferredId && tabs.includes(preferredId) ? preferredId : (tabs[0] || null))
  }

  // Firmware-only tabs (derived from manifest)
  const fwTabs = React.useMemo(() => {
    const seen = new Set()
    const result = []
    firmwareList.forEach((b) => {
      const tabId = b.tab || 'Other'
      if (!seen.has(tabId)) {
        seen.add(tabId)
        result.push({ id: tabId, label: tabId })
      }
    })
    return result
  }, [firmwareList])

  // All tabs: firmware + extra. defaultTabId tab moves to front on both mobile and desktop.
  const tabs = React.useMemo(() => {
    const all = [...fwTabs, ...extraTabs]
    if (defaultTabId) {
      const idx = all.findIndex((t) => t.id === defaultTabId)
      if (idx > 0) {
        const [tab] = all.splice(idx, 1)
        all.unshift(tab)
      }
    } else if (isMobile && mobileDefaultTabId) {
      const idx = all.findIndex((t) => t.id === mobileDefaultTabId)
      if (idx > 0) {
        const [tab] = all.splice(idx, 1)
        all.unshift(tab)
      }
    }
    return all
  }, [fwTabs, extraTabs, isMobile, mobileDefaultTabId, defaultTabId])

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    if (onActiveTabChange) onActiveTabChange(tabId)
  }

  const filteredList = React.useMemo(
    () => firmwareList.filter((b) => (b.tab || 'Other') === activeTab),
    [firmwareList, activeTab]
  )

  // Find active extra tab (if any)
  const activeExtraTab = extraTabs.find((t) => t.id === activeTab)

  const loadFirmware = async (firmware) => {
    if (loadingRef.current) return
    loadingRef.current = true
    setLoadingStatus('loading')

    try {
      const baseUrl = process.env.PUBLIC_URL || ''
      const firmwarePath = `${baseUrl}/firmware/${firmware.path}`
      const partitionsPath = `${baseUrl}/firmware/partitions.bin`
      const isZip = firmware.path.toLowerCase().endsWith('.zip')

      const fwResponse = await fetch(firmwarePath, { cache: 'no-cache' })
      if (!fwResponse.ok) throw new Error(`HTTP ${fwResponse.status}`)

      let fwBlob

      if (isZip) {
        if (!window.JSZip) throw new Error('JSZip not loaded')
        const zipBlob = await fwResponse.blob()
        const zip = new window.JSZip()
        const zipContent = await zip.loadAsync(zipBlob)
        const binFiles = Object.keys(zipContent.files).filter(
          (n) => n.toLowerCase().endsWith('.bin') && !zipContent.files[n].dir
        )
        if (binFiles.length === 0) throw new Error('No .bin in ZIP')
        const binData = await zipContent.files[binFiles[0]].async('arraybuffer')
        fwBlob = new Blob([binData])
      } else {
        fwBlob = await fwResponse.blob()
      }

      const addressIsZero =
        firmware.address === 0 ||
        firmware.address === '0' ||
        firmware.address === '0x0' ||
        firmware.address === 0x0

      const newUploads = []

      if (!addressIsZero) {
        const partRes = await fetch(partitionsPath)
        if (!partRes.ok) throw new Error(`Partitions HTTP ${partRes.status}`)
        const partBlob = await partRes.blob()
        newUploads.push({
          fileName: 'partitions.bin',
          offset: '8000',
          obj: partBlob,
          firmwareInfo: { title: 'Partition Table' },
        })
      }

      newUploads.push({
        fileName: firmware.path,
        offset: firmware.address,
        obj: fwBlob,
        firmwareInfo: firmware,
      })

      setUploads(newUploads)
      setLoadingStatus('loaded')
    } catch (e) {
      console.error('loadFirmware error:', e)
      setLoadingStatus('error')
      setUploads([])
    } finally {
      loadingRef.current = false
    }
  }

  const handleCardClick = (firmware) => {
    setSelectedFirmware(firmware)
    setModalOpen(true)
    setLoadingStatus('idle')
    setUploads([])
    // Start loading firmware immediately when modal opens
    loadFirmware(firmware)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
  }

  const handleStartFlash = (firmware) => {
    if (loadingStatus !== 'loaded' || uploads.length === 0) return
    setModalOpen(false)
    onStartFlash(firmware, uploads)
  }

  if (manifestError) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert
          severity="error"
          sx={{ mb: 2, display: 'inline-flex' }}
          action={
            <Button color="inherit" size="small" startIcon={<RefreshIcon />} onClick={loadManifest}>
              Thử lại
            </Button>
          }
        >
          Không tải được danh sách firmware.
        </Alert>
      </Box>
    )
  }

  if (!manifestLoaded) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
        <CircularProgress color="primary" />
      </Box>
    )
  }

  return (
    <Box>
      {/* Unified tab navigation — sticky just below header */}
      {tabs.length > 1 && (
        <TabBar tabs={tabs} activeTab={activeTab} onChange={handleTabChange} stickyTop={64} />
      )}

      {/* Extra tab content (e.g. Shopping) */}
      {activeExtraTab ? (
        activeExtraTab.content
      ) : (
        <>
          {/* Tab label + count */}
          <Box sx={{ px: { xs: 2, md: 4 }, mb: 2, display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Roboto Mono", monospace',
                color: 'primary.main',
                fontWeight: 700,
              }}
            >
              {activeTab}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {filteredList.length} firmware
            </Typography>
          </Box>

          {/* Cards grid */}
          <Box sx={{ px: { xs: 2, md: 4 }, pb: 4 }}>
            <Grid container spacing={2}>
              {filteredList.map((fw, idx) => (
                <Grid
                  item
                  key={`${fw.path}-${idx}`}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                >
                  <FirmwareCard firmware={fw} onClick={() => handleCardClick(fw)} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      )}

      {/* Firmware detail modal */}
      <FirmwareModal
        firmware={selectedFirmware}
        open={modalOpen}
        onClose={handleCloseModal}
        onStartFlash={handleStartFlash}
        loadingStatus={loadingStatus}
      />
    </Box>
  )
}

FirmwareGrid.propTypes = {
  mobileDefaultTabId: PropTypes.string,
  defaultTabId: PropTypes.string,
  onStartFlash: PropTypes.func.isRequired,
  extraTabs: PropTypes.array,
  onActiveTabChange: PropTypes.func,
}

export default FirmwareGrid
