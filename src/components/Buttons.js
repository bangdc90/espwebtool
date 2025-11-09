import React from 'react'
import PropTypes from 'prop-types'

import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'

const Buttons = (props) => {
    const hasFirmware = props.selectedFirmware != null
    const needsKey = props.selectedFirmware?.requireKey === true
    const canProgram = hasFirmware && (!needsKey || props.keyActivated)
    
    // Determine button text
    let buttonText = 'NẠP CHƯƠNG TRÌNH'
    if (!hasFirmware) {
        buttonText = 'Chọn firmware để nạp'
    } else if (needsKey && !props.keyActivated) {
        buttonText = 'Bấm Mua Key để nạp'
    }
    
    const handleClick = () => {
        if (!hasFirmware) {
            // No firmware selected - do nothing
            return
        }
        
        if (canProgram) {
            props.program()
        } else {
            // Open buy key dialog
            if (props.onBuyKey) {
                props.onBuyKey()
            }
        }
    }

    return (
        <Grid container spacing={1} direction='row' justifyContent='center' alignItems='flex-start'>
            <Grid item>
                <Button
                    variant='contained'
                    color='success'
                    onClick={handleClick}
                    disabled={props.disabled || !hasFirmware}
                    size='large'
                >
                    {buttonText}
                </Button>
            </Grid>
        </Grid>
    )
}

Buttons.propTypes = {
    program: PropTypes.func,
    disabled: PropTypes.bool,
    selectedFirmware: PropTypes.object,
    keyActivated: PropTypes.bool,
    onBuyKey: PropTypes.func,
}

export default Buttons