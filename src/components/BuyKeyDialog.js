import React from 'react'
import PropTypes from 'prop-types'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'

const BuyKeyDialog = ({ open, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                Cần mua key để nạp (30K)
            </DialogTitle>
            <DialogContent>
                <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="body1" gutterBottom>
                        Nhắn tin tới{' '}
                        <Link 
                            href="https://facebook.com/share/1FL2bgyc7x/?mibextid=wwXIfr" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            sx={{ fontWeight: 'bold' }}
                        >
                            Facebook
                        </Link>
                        {' '}để mua key
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button 
                    variant="contained" 
                    onClick={onClose}
                    size="large"
                >
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    )
}

BuyKeyDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default BuyKeyDialog
