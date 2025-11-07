import React from 'react'
import PropTypes from 'prop-types'

import Box from '@mui/material/Grid'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import ChromeIcon from '../icons/Chrome'
import EdgeIcon from '../icons/Edge'
import OperaIcon from '../icons/Opera'
import SettingsIcon from '@mui/icons-material/Settings'

const Home = (props) => {
    // Check if test mode is enabled via environment variable
    const isTestModeEnabled = process.env.REACT_APP_ENABLE_TEST_MODE === 'true'

    return (
        <Grid
            container
            spacing={0}
            direction='column'
            alignItems='center'
            justifyContent='center'
        >
            <Grid item xs={3}>

                {props.supported() ?
                    <Box align='center'>
                        <Box>
                            <Button variant='contained' color='success' size='large' onClick={props.connect} sx={{ m: 1 }}>
                                Connect
                            </Button>
                        </Box>

                        <Box>
                            <Button size='large' onClick={props.openSettings} sx={{ m: 1, color:'#bebebe' }}>
                                <SettingsIcon />
                            </Button>
                        </Box>

                        {/* Test Mode button - only show when enabled in .env.local */}
                        {isTestModeEnabled && (
                            <Box>
                                <Button variant='outlined' color='warning' size='small' onClick={props.testMode} sx={{ m: 1 }}>
                                    🧪 Test Mode (Bypass Connect)
                                </Button>
                            </Box>
                        )}

                        <Alert severity='info' align='left'>
                            Cắm dây USB vào mạch và bấm CONNECT 😊<br />
                            Không cần nhấn nút BOOT hay Wake Up
                        </Alert>
                    </Box>

                    :

                    <Alert severity='warning'>
                        <AlertTitle>Your browser doesn&apos;t support Web Serial 😭</AlertTitle>
                        Try using&nbsp;
                        <a href='https://www.google.com/chrome/' target='blank'>
                            <ChromeIcon fontSize='inherit' /> <b>Chrome</b>
                        </a>
                        ,&nbsp;
                        <a href='https://www.microsoft.com/en-us/edge' target='blank'>
                            <EdgeIcon fontSize='inherit' /> <b>Edge</b>
                        </a>
                        , or&nbsp;
                        <a href='https://www.opera.com/' target='blank'>
                            <OperaIcon fontSize='inherit' /> <b>Opera</b>
                        </a>
                        <br />
                        (IOS & Android browsers are not supported)
                        <br />
                        <br />
                        Learn more about&nbsp;
                        <a href='https://developer.mozilla.org/en-US/docs/Web/API/Serial#browser_compatibility' target='blank'>
                            browser compatibility
                        </a>
                    </Alert>
                }
            </Grid>

        </Grid>
    )
}

Home.propTypes = {
    connect: PropTypes.func,
    supported: PropTypes.func,
    openSettings: PropTypes.func,
    testMode: PropTypes.func,
}

export default Home