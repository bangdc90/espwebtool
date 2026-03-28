import React, { useEffect, useCallback } from 'react'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { ThemeProvider, CssBaseline } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import theme from './theme'
import { ConnectionProvider, useConnection } from './context/ConnectionContext'

import Header from './components/Header'
import FirmwareGrid from './components/FirmwareGrid'
import Output from './components/Output'
import Settings from './components/Settings'
import ConfirmWindow from './components/ConfirmWindow'
import Footer from './components/Footer'
import DonateImage from './components/DonateImage'
import ShoppingTab from './components/ShoppingTab'
import WelcomeDialog from './components/WelcomeDialog'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

import PropTypes from 'prop-types'
import { loadSettings, defaultSettings } from './lib/settings'

// ─── Extra tabs appended to the firmware tab bar ─────────────────────────────────
const EXTRA_TABS = [
  {
    id: 'shopping',
    label: 'Mua sắm',
    icon: <ShoppingCartIcon sx={{ fontSize: 16 }} />,
    tabSx: {
      background: 'linear-gradient(135deg, #E65100 0%, #FF8F00 100%)',
      color: '#fff',
      borderRadius: '6px 6px 0 0',
      fontWeight: 600,
      mx: 0.5,
      minHeight: 48,
      '&.Mui-selected': {
        color: '#fff',
        background: 'linear-gradient(135deg, #BF360C 0%, #E65100 100%)',
      },
      '&:hover': {
        background: 'linear-gradient(135deg, #F4511E 0%, #FFA000 100%)',
        opacity: 1,
      },
    },
    content: <ShoppingTab />,
  },
]

// ─── Inner UI — rendered inside ConnectionProvider so it can call useConnection ─────
const FlashUI = ({ settings, setSettings, output, addOutput }) => {
  const { espStub } = useConnection()
  const [shoppingActive, setShoppingActive] = React.useState(false)
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  const [confirmProgram, setConfirmProgram] = React.useState(false)
  const [flashing, setFlashing] = React.useState(false)
  const [pendingFlash, setPendingFlash] = React.useState(null)

  const handleStartFlash = (firmware, uploads) => {
    setPendingFlash({ firmware, uploads })
    setConfirmProgram(true)
  }

  const program = async () => {
    if (!pendingFlash) return
    setConfirmProgram(false)
    setFlashing(true)
    const { uploads } = pendingFlash

    const toBinaryString = (file) => {
      const reader = new FileReader()
      return new Promise((resolve, reject) => {
        reader.onerror = () => { reader.abort(); reject(new DOMException('Problem parsing input file.')) }
        reader.onload = () => resolve(reader.result)
        reader.readAsBinaryString(file)
      })
    }

    const fileArray = []
    for (const file of uploads) {
      if (!file.fileName || !file.obj) continue
      const contents = await toBinaryString(file.obj)
      fileArray.push({ data: contents, address: parseInt(file.offset, 16) })
      addOutput(`Prepared ${file.fileName} at 0x${file.offset} (${contents.length} bytes)`)
    }

    if (fileArray.length === 0) {
      addOutput('No firmware files.')
      toast.info('Không có file firmware', { position: 'top-center', autoClose: 3000 })
      setFlashing(false)
      return
    }

    if (!espStub) {
      addOutput('Mất kết nối ESP32. Vui lòng kết nối lại.')
      toast.error('Mất kết nối ESP32', { position: 'top-center', autoClose: 3000 })
      setFlashing(false)
      return
    }

    try {
      addOutput('Starting flash...')
      toast.info('Đang nạp chương trình...', { position: 'top-center', autoClose: false, toastId: 'flashing' })

      await espStub.writeFlash({
        fileArray,
        flashSize: 'keep',
        flashMode: 'keep',
        flashFreq: 'keep',
        eraseAll: false,
        compress: true,
        reportProgress: (fileIndex, written, total) => {
          const progress = written / total
          const pct = Math.floor(progress * 100)
          const desc =
            uploads[fileIndex]?.firmwareInfo?.title ||
            uploads[fileIndex]?.fileName ||
            `File ${fileIndex + 1}`
          if (pct >= 100) {
            toast.update('flashing', { render: 'Đang xác minh... Vui lòng chờ', progress: 0.99 })
            addOutput(`Flashing ${desc}... 100% - Verifying...`)
          } else {
            toast.update('flashing', { render: `Flashing ${desc}... ${pct}%`, progress })
            addOutput(`Flashing ${desc}... ${pct}%`)
          }
        },
      })

      addOutput('All files flashed successfully!')
      addOutput('Reset thiết bị để chạy chương trình mới.')
      toast.dismiss('flashing')
      toast.success('Hoàn tất! Reset thiết bị để chạy chương trình mới', {
        position: 'top-center',
        autoClose: 6000,
        toastId: 'flash-complete',
      })
    } catch (e) {
      addOutput(`ERROR: ${e}`)
      console.error(e)
      toast.dismiss('flashing')
      toast.error(`Lỗi nạp: ${e.message || e}`, {
        position: 'top-center',
        autoClose: 5000,
        toastId: 'flash-error',
      })
    }

    setFlashing(false)
    setPendingFlash(null)
  }

  return (
    <Box sx={{ minWidth: '320px', minHeight: '100vh' }}>
      <Header onOpenSettings={() => setSettingsOpen(true)} flashing={flashing} />
      <DonateImage />

      {/* Hero banner */}
      <Box
        sx={{
          textAlign: 'center',
          py: { xs: 1.5, md: 2.5 },
          px: 2,
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            color: '#f5f5f7',
            mb: 1,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.4rem' },
            letterSpacing: '-0.02em',
          }}
        >
          Vọc, Vọc nữa, Vọc mãi
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 560, mx: 'auto' }}>
          Chọn đúng FW với chip ESP32 của bạn (ESP32C3, ESP32S3 hoặc ESP32 thường)
        </Typography>
      </Box>

      {/* Firmware grid with Shopping tab appended */}
      <Box sx={{ mt: 1 }}>
        <FirmwareGrid
          onStartFlash={handleStartFlash}
          extraTabs={EXTRA_TABS}
          onActiveTabChange={(tabId) => setShoppingActive(tabId === 'shopping')}
        />
      </Box>

      {/* Output log — hide when shopping tab is active */}
      {!shoppingActive && (
        <Box sx={{ px: { xs: 2, md: 4 }, pb: 2 }}>
          <Output received={output} />
        </Box>
      )}

      <Settings
        open={settingsOpen}
        close={() => setSettingsOpen(false)}
        setSettings={setSettings}
        settings={settings}
      />

      <ConfirmWindow
        open={confirmProgram}
        text="Nạp chương trình mới sẽ ghi đè lên chương trình hiện tại."
        onOk={program}
        onCancel={() => setConfirmProgram(false)}
      />

      <ToastContainer theme="dark" />
      <WelcomeDialog />
      <Footer sx={{ mt: 2, pb: 2, textAlign: 'center' }} />
    </Box>
  )
}

FlashUI.propTypes = {
  settings: PropTypes.object.isRequired,
  setSettings: PropTypes.func.isRequired,
  output: PropTypes.object.isRequired,
  addOutput: PropTypes.func.isRequired,
}

// ─── Root component — holds shared state, wraps in providers ─────────────────────
const App = () => {
  const [settings, setSettings] = React.useState({ ...defaultSettings })
  const [output, setOutput] = React.useState({ time: new Date(), value: 'Ready.\n' })

  useEffect(() => {
    setSettings(loadSettings())
  }, [])

  const addOutput = useCallback((msg) => {
    setOutput({ time: new Date(), value: `${msg}\n` })
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ConnectionProvider settings={settings} onAddOutput={addOutput}>
        <FlashUI
          settings={settings}
          setSettings={setSettings}
          output={output}
          addOutput={addOutput}
        />
      </ConnectionProvider>
    </ThemeProvider>
  )
}

export default App