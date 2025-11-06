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

import { connectESP, formatMacAddr, sleep, supported } from './lib/esp'
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
      await espStub.disconnect()
      await espStub.port.close()
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
      toast.info('Connecting...', { 
        position: 'top-center', 
        autoClose: false, 
        toastId: 'connecting' 
      })
      toast.update('connecting', {
        render: 'Connecting...',
        type: toast.TYPE.INFO,
        autoClose: false
      })

      setConnecting(true)

      await esploader.initialize()

      addOutput(`Connected to ${esploader.chipName}`)
      addOutput(`MAC Address: ${formatMacAddr(esploader.macAddr())}`)

      const newEspStub = await esploader.runStub()

      setConnected(true)
      toast.update('connecting', {
        render: 'Connected 🚀',
        type: toast.TYPE.SUCCESS,
        autoClose: 3000
      })

      //console.log(newEspStub)

      newEspStub.port.addEventListener('disconnect', () => {
        setConnected(false)
        setEspStub(undefined)
        toast.warning('Disconnected 💔', { position: 'top-center', autoClose: 3000, toastId: 'settings' })
        addOutput(`------------------------------------------------------------`)
      })

      setEspStub(newEspStub)
      setChipName(esploader.chipName)
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

  // Flash Firmware
  const program = async () => {
    setConfirmProgram(false)
    setFlashing(true)

    let success = false

    const toArrayBuffer = (inputFile) => {
      const reader = new FileReader()

      return new Promise((resolve, reject) => {
        reader.onerror = () => {
          reader.abort();
          reject(new DOMException('Problem parsing input file.'));
        }

        reader.onload = () => {
          resolve(reader.result);
        }
        reader.readAsArrayBuffer(inputFile)
      })
    }

    for (let i = 0; i < uploads.length; i++) {
      const file = uploads[i]
      if (!file.fileName || !file.obj) continue
      success = true

      const fileNumber = i + 1
      const totalFiles = uploads.length
      const fileDesc = file.firmwareInfo?.title || file.fileName
      
      addOutput(`Step ${fileNumber}/${totalFiles}: Uploading ${fileDesc} to address 0x${file.offset}`)
      toast(`Uploading ${fileDesc}...`, { position: 'top-center', progress: 0, toastId: `upload-${i}` })

      try {
        const contents = await toArrayBuffer(file.obj)

        await espStub.flashData(
          contents,
          (bytesWritten, totalBytes) => {
            const progress = (bytesWritten / totalBytes)
            const percentage = Math.floor(progress * 100)

            toast.update(`upload-${i}`, { progress: progress })

            addOutput(`Flashing ${fileDesc}... ${percentage}%`)
          },
          parseInt(file.offset, 16)
        )

        addOutput(`Completed flashing ${fileDesc}`)
        await sleep(100)
      } catch (e) {
        addOutput(`ERROR flashing ${fileDesc}!`)
        addOutput(`${e}`)
        console.error(e)
      }
    }

    if (success) {
      addOutput(`All files flashed successfully!`)
      addOutput(`To run the new firmware please reset your device.`)

      toast.success('Done! Reset ESP to run new firmware.', { position: 'top-center', toastId: 'uploaded', autoClose: 3000 })
    } else {
      addOutput(`Please add firmware files`)

      toast.info('Please add firmware files', { position: 'top-center', toastId: 'uploaded', autoClose: 3000 })
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
              program={() => setConfirmProgram(true)}
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
        text={'Flashing new firmware will override the current firmware.'}
        onOk={program}
        onCancel={() => setConfirmProgram(false)}
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