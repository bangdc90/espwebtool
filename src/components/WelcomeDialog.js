import React, { useEffect, useState } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CloseIcon from '@mui/icons-material/Close'

const FB_URL =
  'https://www.facebook.com/profile.php?id=61581220204083&rdid=jpp0GRtyzgJMAsEM'

const STORAGE_KEY = 'vocsi_welcomed'

const WelcomeDialog = () => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setOpen(true)
    }
  }, [])

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: '18px' } }}
    >
      <DialogTitle sx={{ pb: 0, pr: 6 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#f5f5f7', fontSize: '1.1rem' }}>
          Chào mừng bạn!
        </Typography>
        <IconButton
          onClick={handleClose}
          size="small"
          aria-label="Đóng"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            color: '#6e6e73',
            '&:hover': { color: '#f5f5f7' },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1.5 }}>
        <Box
          component="a"
          href={FB_URL}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mt: 2,
            p: 1.5,
            borderRadius: '10px',
            background: 'rgba(24,119,242,0.12)',
            border: '1px solid rgba(24,119,242,0.25)',
            textDecoration: 'none',
            transition: 'border-color 0.2s',
            '&:hover': { borderColor: 'rgba(24,119,242,0.5)' },
          }}
        >
          {/* FB logo */}
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#1877f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontWeight: 900,
              color: '#fff',
              fontSize: '1.1rem',
            }}
          >
            f
          </Box>
          <Box>
            <Typography
              variant="body2"
              sx={{ color: '#f5f5f7', fontWeight: 600, lineHeight: 1.3 }}
            >
              Tham gia Fanpage chính thức
            </Typography>
            <Typography variant="caption" sx={{ color: '#6e6e73' }}>
              Hội Vọc Sĩ
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 0 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleClose}
          sx={{ borderRadius: '10px', fontWeight: 600, py: 1 }}
        >
          OK, bắt đầu thôi!
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default WelcomeDialog
