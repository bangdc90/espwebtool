import React from 'react'
import PropTypes from 'prop-types'

import { toast } from 'react-toastify'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'

import { baudrates, saveSettings } from '../lib/settings'
import { useConnection } from '../context/ConnectionContext'

const Settings = (props) => {
    const { connected } = useConnection()
    const [baudRate, setBaudRate] = React.useState(props.settings.baudRate)

    const cancel = () => {
        setBaudRate(props.settings.baudRate)
        props.close()
    }

    const reset = () => {
        if (!connected) setBaudRate(115200)
    }

    const save = () => {
        saveSettings({ baudRate: baudRate })
        props.setSettings({ baudRate: baudRate })
        props.close()
        toast.success('Đã lưu cài đặt', { position: 'top-center', autoClose: 3000, toastId: 'settings' })
    }

    return (
        <Dialog open={props.open} onClose={props.close}>
            <DialogTitle>Cài đặt</DialogTitle>

            <DialogContent>
                <DialogContentText>
                    Kết nối Serial
                </DialogContentText>

                <FormControl variant='filled' fullWidth sx={{ mt: 1, minWidth: '10em' }}>
                    <InputLabel>Baud Rate {connected && '(Cần kết nối lại)'}</InputLabel>
                    <Select
                        value={baudRate}
                        onChange={(e) => setBaudRate(e.target.value)}
                        label='baudrate'
                        disabled={connected}
                    >
                        {baudrates.map(baud =>
                            <MenuItem value={baud} key={baud}>{baud} baud</MenuItem>
                        )}
                    </Select>
                </FormControl>
            </DialogContent>

            <DialogActions>
                <Button onClick={reset} color='error'>Reset</Button>
                <Button onClick={cancel} color='secondary'>Hủy</Button>
                <Button onClick={save} color='primary'>Lưu</Button>
            </DialogActions>
        </Dialog>
    )
}

Settings.propTypes = {
    open: PropTypes.bool,
    close: PropTypes.func,
    settings: PropTypes.object,
    setSettings: PropTypes.func,
}

export default Settings