import React from 'react'
import PropTypes from 'prop-types'

import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import VisitCounter from './VisitCounter'

const Header = (props) => {
    return (
        <AppBar
            position='static'
            sx={{
                ...props.sx,
                background: '#0276aa',
            }}
        >
            <Toolbar>
                <Typography
                    variant='h6'
                    component='h1'
                    noWrap
                    sx={{ 
                        fontFamily: 'Roboto, Arial, sans-serif',
                    }}
                >
                    Mr Vọc Sĩ
                </Typography>
                <Box sx={{ marginLeft: 'auto' }}>
                    <VisitCounter />
                </Box>
            </Toolbar>
        </AppBar>
    )
}

Header.propTypes = {
    sx: PropTypes.object,
}

export default Header