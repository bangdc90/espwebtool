import React, { useEffect } from 'react'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import Header from './components/Header'
import Home from './components/Home'
import PreBuiltFirmware from './components/PreBuiltFirmware'
import Output from './components/Output'
import Buttons from './components/Buttons'
import Settings from './components/Settings'
import ConfirmWindow from './components/ConfirmWindow'
import Footer from './components/Footer'
import DonateImage from './components/DonateImage'
import BuyKeyDialog from './components/BuyKeyDialog'
import DonationDialog from './components/DonationDialog'

import { connectESP, supported } from './lib/esp'
import { loadSettings, defaultSettings } from './lib/settings'

const App = () => {
  const [connected, setConnected] = React.useState(false) // Connection status
  const [connecting, setConnecting] = React.useState(false)
  const [output, setOutput] = React.useState({ time: new Date(), value: 'Click Connect to start\n' }) // Serial output
  const [espStub, setEspStub] = React.useState(undefined) // ESP flasher stuff
  const [uploads, setUploads] = React.useState([]) // Uploaded Files
  const [settingsOpen, setSettingsOpen] = React.useState(false) // Settings Window
  const [settings, setSettings] = React.useState({...defaultSettings}) // Settings
  const [confirmProgram, setConfirmProgram] = React.useState(false) // Confirm Flash Window
  const [flashing, setFlashing] = React.useState(false) // Enable/Disable buttons
  const [chipName, setChipName] = React.useState('') // ESP8266 or ESP32
  const [selectedFirmwareInfo, setSelectedFirmwareInfo] = React.useState(null) // Selected firmware info
  const [keyActivated, setKeyActivated] = React.useState(false) // Key activation status
  const [buyKeyDialogOpen, setBuyKeyDialogOpen] = React.useState(false) // Buy key dialog
  const [donationDialogOpen, setDonationDialogOpen] = React.useState(false) // Donation dialog for free firmware

  useEffect(() => {
    setSettings(loadSettings())
  }, [])

  // Add new message to output
  const addOutput = (msg) => {
    setOutput({
      time: new Date(),
      value: `${msg}\n`,
    })
  }

  // Connect to ESP & init flasher stuff
  const clickConnect = async () => {
    if (espStub) {
      await espStub.transport.disconnect()
      setEspStub(undefined)
      return
    }

    const esploader = await connectESP({
      log: (...args) => addOutput(`${args[0]}`),
      debug: (...args) => console.debug(...args),
      error: (...args) => console.error(...args),
      baudRate: parseInt(settings.baudRate),
    })

    try {
      toast.info('Đang kết nối...', { 
        position: 'top-center', 
        autoClose: false, 
        toastId: 'connecting' 
      })
      toast.update('connecting', {
        render: 'Đang kết nối...',
        type: toast.TYPE.INFO,
        autoClose: false
      })

      setConnecting(true)

      // Connect and detect chip (esptool-js API)
      await esploader.main()

      addOutput(`Connected to ${esploader.chip.CHIP_NAME}`)
      addOutput(`MAC Address: (Reading MAC address from chip...)`)

      // NOTE: Do NOT call runStub() before writeFlash()
      // runStub() loads stub into RAM which may conflict with firmware addresses
      // writeFlash() will handle everything automatically

      setConnected(true)
      toast.update('connecting', {
        render: 'Kết nối thành công 🚀',
        type: toast.TYPE.SUCCESS,
        autoClose: 3000
      })

      // Listen for disconnect on transport device
      esploader.transport.device.addEventListener('disconnect', () => {
        setConnected(false)
        setEspStub(undefined)
        toast.warning('Đã ngắt kết nối 💔', { position: 'top-center', autoClose: 3000, toastId: 'settings' })
        addOutput(`------------------------------------------------------------`)
      })

      setEspStub(esploader)
      setChipName(esploader.chip.CHIP_NAME)
    } catch (err) {
      const shortErrMsg = `${err}`.replace('Error: ','')

      toast.update('connecting', {
        render: shortErrMsg,
        type: toast.TYPE.ERROR,
        autoClose: 3000
      })

      addOutput(`${err}`)

      await esploader.port.close()
      await esploader.disconnect()
    } finally {
      setConnecting(false)
    }
  }

  // Handle program button click - show donation dialog for free firmware first
  const handleProgramClick = () => {
    // Check if firmware requires key (paid firmware)
    const isFreefirmware = !selectedFirmwareInfo?.requireKey
    
    if (isFreefirmware) {
      // Show donation dialog first for free firmware
      setDonationDialogOpen(true)
    } else {
      // For paid firmware, go directly to confirm dialog
      setConfirmProgram(true)
    }
  }

  // Handle donation dialog OK - proceed to confirm dialog
  const handleDonationOk = () => {
    setDonationDialogOpen(false)
    setConfirmProgram(true)
  }

  // Enable test mode - bypass connection
  const enableTestMode = () => {
    setConnected(true)
    setChipName('ESP32 (Test Mode)')
    addOutput('Test Mode Enabled - No device connected')
    addOutput('You can test the UI without a real device')
    toast.info('Chế độ Test đã bật 🧪', { position: 'top-center', autoClose: 3000 })
  }

  // Flash Firmware
  const program = async () => {
    setConfirmProgram(false)
    setFlashing(true)

    const toBinaryString = (inputFile) => {
      const reader = new FileReader()

      return new Promise((resolve, reject) => {
        reader.onerror = () => {
          reader.abort();
          reject(new DOMException('Problem parsing input file.'));
        }

        reader.onload = () => {
          resolve(reader.result);
        }
        // esptool-js requires binary string, not ArrayBuffer
        reader.readAsBinaryString(inputFile)
      })
    }

    // Prepare file array for esptool-js writeFlash API
    const fileArray = []
    
    for (let i = 0; i < uploads.length; i++) {
      const file = uploads[i]
      if (!file.fileName || !file.obj) continue
      
      const contents = await toBinaryString(file.obj)
      const fileDesc = file.firmwareInfo?.title || file.fileName
      
      fileArray.push({
        data: contents,
        address: parseInt(file.offset, 16)
      })
      
      addOutput(`Prepared ${fileDesc} at address 0x${file.offset} (${contents.length} bytes)`)
    }

    if (fileArray.length === 0) {
      addOutput(`Please add firmware files`)
      toast.info('Vui lòng chọn file firmware', { position: 'top-center', toastId: 'uploaded', autoClose: 3000 })
      setFlashing(false)
      return
    }

    try {
      addOutput(`Starting flash process...`)
      toast.info('Đang nạp chương trình...', { position: 'top-center', autoClose: false, toastId: 'flashing' })

      // Use writeFlash from esptool-js
      await espStub.writeFlash({
        fileArray: fileArray,
        flashSize: 'keep',
        flashMode: 'keep',
        flashFreq: 'keep',
        eraseAll: false,
        compress: true,
        reportProgress: (fileIndex, written, total) => {
          const progress = (written / total)
          const percentage = Math.floor(progress * 100)
          const fileDesc = uploads[fileIndex]?.firmwareInfo?.title || uploads[fileIndex]?.fileName || `File ${fileIndex + 1}`
          
          toast.update('flashing', { 
            render: `Flashing ${fileDesc}... ${percentage}%`,
            progress: progress 
          })
          
          addOutput(`Flashing ${fileDesc}... ${percentage}%`)
        }
      })

      addOutput(`All files flashed successfully!`)
      addOutput(`To run the new firmware please reset your device.`)

      // Dismiss the progress toast and show success toast
      toast.dismiss('flashing')
      toast.success('Hoàn tất! Reset thiết bị để chạy chương trình mới 🎉', { 
        position: 'top-center', 
        autoClose: 5000,
        toastId: 'flash-complete'
      })
    } catch (e) {
      addOutput(`ERROR flashing firmware!`)
      addOutput(`${e}`)
      console.error(e)
      
      // Dismiss progress toast and show error
      toast.dismiss('flashing')
      toast.error(`Lỗi nạp chương trình: ${e.message || e}`, {
        position: 'top-center',
        autoClose: 5000,
        toastId: 'flash-error'
      })
    }

    setFlashing(false)
  }

  return (
    <Box sx={{ minWidth: '25rem' }}>
      <Header sx={{ mb: '1rem' }} />
      
      {/* Donate Image - Fixed position at top right */}
      <DonateImage />

      <Grid container spacing={1} direction='column' justifyContent='space-around' alignItems='center' sx={{ minHeight: 'calc(100vh - 116px)' }}>

        {/* Home Page */}
        {!connected && !connecting &&
          <Grid item>
            <Home
              connect={clickConnect}
              supported={supported}
              openSettings={() => setSettingsOpen(true)}
              testMode={enableTestMode}
            />
          </Grid>
        }

        {/* Home Page */}
        {!connected && connecting &&
          <Grid item>
            <Typography variant='h3' component='h2' sx={{ color: '#aaa' }}>
              Connecting...
            </Typography>
          </Grid>
        }

        {/* Pre-built Firmware Page */}
        {connected &&
          <Grid item>
            <PreBuiltFirmware
              setUploads={setUploads}
              chipName={chipName}
              setSelectedFirmwareInfo={setSelectedFirmwareInfo}
              setKeyActivated={setKeyActivated}
            />
          </Grid>
        }

        {/* Program Button */}
        {connected &&
          <Grid item>
            <Buttons
              program={handleProgramClick}
              disabled={flashing}
              selectedFirmware={selectedFirmwareInfo}
              keyActivated={keyActivated}
              onBuyKey={() => setBuyKeyDialogOpen(true)}
            />
          </Grid>
        }

        {/* Serial Output */}
        {supported() &&
          <Grid item>
            <Output received={output} />
          </Grid>
        }
      </Grid>

      {/* Settings Window */}
      <Settings
        open={settingsOpen}
        close={() => setSettingsOpen(false)}
        setSettings={setSettings}
        settings={settings}
        connected={connected}
      />

      {/* Confirm Flash/Program Window */}
      <ConfirmWindow
        open={confirmProgram}
        text={'Nạp chương trình mới sẽ ghi đè lên chương trình hiện tại.'}
        onOk={program}
        onCancel={() => setConfirmProgram(false)}
      />

      {/* Donation Dialog for Free Firmware */}
      <DonationDialog
        open={donationDialogOpen}
        onOk={handleDonationOk}
        onClose={() => setDonationDialogOpen(false)}
      />

      {/* Buy Key Dialog */}
      <BuyKeyDialog
        open={buyKeyDialogOpen}
        onClose={() => setBuyKeyDialogOpen(false)}
      />

      {/* Toaster */}
      <ToastContainer />

      {/* Footer */}
      <Footer sx={{ mt: 'auto' }} />
    </Box>
  )
}

export default App