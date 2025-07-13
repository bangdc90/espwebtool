import React from 'react'
import PropTypes from 'prop-types'

import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'

const Buttons = (props) => {
    return (
        <Grid container spacing={1} direction='row' justifyContent='center' alignItems='flex-start'>
            <Grid item>
                <Button
                    variant='contained'
                    color='success'
                    onClick={props.program}
                    disabled={props.disabled}
                    size='large'
                >
                    Program
                </Button>
            </Grid>
        </Grid>
    )
}

Buttons.propTypes = {
    program: PropTypes.func,
    disabled: PropTypes.bool,
}

export default Buttons