import React, { createContext, useContext, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { connectESP, supported } from '../lib/esp'

const ConnectionContext = createContext(null)

export const ConnectionProvider = ({ children, settings, onAddOutput }) => {
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [espStub, setEspStub] = useState(undefined)
  const [chipName, setChipName] = useState('')

  const connect = useCallback(async () => {
    if (espStub) {
      await espStub.transport.disconnect()
      setEspStub(undefined)
      setConnected(false)
      setChipName('')
      return
    }

    const esploader = await connectESP({
      log: (...args) => onAddOutput(`${args[0]}`),
      debug: (...args) => console.debug(...args),
      error: (...args) => console.error(...args),
      baudRate: parseInt(settings.baudRate),
    })

    try {
      toast.info('Đang kết nối...', {
        position: 'top-center',
        autoClose: false,
        toastId: 'connecting',
      })

      setConnecting(true)
      await esploader.main()

      onAddOutput(`Connected to ${esploader.chip.CHIP_NAME}`)

      setConnected(true)
      toast.update('connecting', {
        render: 'Kết nối thành công',
        type: toast.TYPE.SUCCESS,
        autoClose: 3000,
      })

      esploader.transport.device.addEventListener('disconnect', () => {
        setConnected(false)
        setEspStub(undefined)
        setChipName('')
        toast.warning('Đã ngắt kết nối', {
          position: 'top-center',
          autoClose: 3000,
          toastId: 'disconnected',
        })
        onAddOutput('------------------------------------------------------------')
      })

      setEspStub(esploader)
      setChipName(esploader.chip.CHIP_NAME)
    } catch (err) {
      const shortErrMsg = `${err}`.replace('Error: ', '')
      toast.update('connecting', {
        render: shortErrMsg,
        type: toast.TYPE.ERROR,
        autoClose: 3000,
      })
      onAddOutput(`${err}`)
      await esploader.port.close()
      await esploader.disconnect()
    } finally {
      setConnecting(false)
    }
  }, [espStub, settings, onAddOutput])

  const enableTestMode = useCallback(() => {
    setConnected(true)
    setChipName('ESP32 (Test Mode)')
    onAddOutput('Test Mode Enabled - No device connected')
    toast.info('Chế độ Test đã bật', { position: 'top-center', autoClose: 3000 })
  }, [onAddOutput])

  return (
    <ConnectionContext.Provider
      value={{
        connected,
        connecting,
        espStub,
        chipName,
        supported,
        connect,
        enableTestMode,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  )
}

ConnectionProvider.propTypes = {
  children: PropTypes.node.isRequired,
  settings: PropTypes.shape({ baudRate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]) }).isRequired,
  onAddOutput: PropTypes.func.isRequired,
}

export const useConnection = () => {
  const ctx = useContext(ConnectionContext)
  if (!ctx) throw new Error('useConnection must be used within ConnectionProvider')
  return ctx
}

export default ConnectionContext
