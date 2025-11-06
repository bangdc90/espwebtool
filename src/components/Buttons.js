import React from 'react'
import PropTypes from 'prop-types'

import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'

const Buttons = (props) => {
    const needsKey = props.selectedFirmware?.requireKey === true
    const canProgram = !needsKey || props.keyActivated
    const buttonText = !canProgram ? 'Bấm Mua Key để nạp' : 'NẠP CHƯƠNG TRÌNH'
    
    const handleClick = () => {
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
                    disabled={props.disabled}
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