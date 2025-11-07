import React from 'react'
import PropTypes from 'prop-types'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import Box from '@mui/material/Box'

const DonationDialog = (props) => {
    return (
        <Dialog 
            open={props.open} 
            onClose={props.onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogContent>
                <Box sx={{ textAlign: 'left', py: 2 }}>
                    <DialogContentText 
                        sx={{ 
                            whiteSpace: 'pre-line',
                            fontSize: '1rem',
                            lineHeight: 1.8,
                            color: 'text.primary',
                            textAlign: 'left'
                        }}
                    >
                        🔊 Kênh hoạt động hoàn toàn phi lợi nhuận, chia sẻ phần mềm miễn phí phục vụ cộng đồng
                        {'\n'}
                        🚀 Mọi chi phí nghiên cứu fw, lưu trữ và duy trì web đều do mình tự chi trả
                        {'\n'}
                        💖 Nếu bạn yêu quý, hãy đóng góp 1 phần nhỏ để cùng mình giữ kênh tồn tại lâu dài 💖
                        {'\n\n'}
                        ➡️ BẤM OK ĐỂ TIẾP TỤC NẠP
                    </DialogContentText>
                </Box>
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
                <Button 
                    onClick={props.onOk} 
                    variant="contained" 
                    color="primary"
                    size="large"
                    sx={{ minWidth: '120px' }}
                >
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    )
}

DonationDialog.propTypes = {
    open: PropTypes.bool,
    onOk: PropTypes.func,
    onClose: PropTypes.func
}

export default DonationDialog
