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

                    <Alert severity='error' sx={{ 
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        '& .MuiAlert-message': {
                            width: '100%'
                        }
                    }}>
                        <AlertTitle sx={{ fontSize: '1.3rem', fontWeight: 'bold', mb: 2 }}>
                            ⚠️ CHÚ Ý ⚠️
                        </AlertTitle>
                        <Box sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                            Sử dụng MÁY TÍNH để truy cập và nạp chương trình.
                            <br />
                            <br />
                            <strong>Không hỗ trợ nạp bằng ĐIỆN THOẠI</strong>
                        </Box>
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