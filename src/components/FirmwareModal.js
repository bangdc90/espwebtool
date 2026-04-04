import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Link from '@mui/material/Link'
import Divider from '@mui/material/Divider'
import CloseIcon from '@mui/icons-material/Close'
import YouTubeIcon from '@mui/icons-material/YouTube'
import UsbIcon from '@mui/icons-material/Usb'
import FlashOnIcon from '@mui/icons-material/FlashOn'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import FacebookIcon from '@mui/icons-material/Facebook'

import PropTypes from 'prop-types'
import { useConnection } from '../context/ConnectionContext'

const chipColors = {
  ESP32S3: '#2997ff',
  'ESP32-C3': '#9b7ff5',
  ESP32C3: '#9b7ff5',
  ESP32: '#34c759',
}

const DescriptionItem = ({ text }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 1,
      py: 0.5,
    }}
  >
    <Box
      sx={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.3)',
        mt: '6px',
        flexShrink: 0,
      }}
    />
    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
      {text}
    </Typography>
  </Box>
)

DescriptionItem.propTypes = { text: PropTypes.string.isRequired }

const FirmwareModal = ({ firmware, open, onClose, onStartFlash, loadingStatus }) => {
  const { connected, connecting, connect } = useConnection()
  const [keyInput, setKeyInput] = useState('')
  const [keyActivated, setKeyActivated] = useState(false)
  const [keyVerifying, setKeyVerifying] = useState(false)
  const [keyError, setKeyError] = useState('')
  const [showKeySection, setShowKeySection] = useState(false)

  // Reset key state when firmware changes
  React.useEffect(() => {
    setKeyInput('')
    setKeyActivated(false)
    setKeyError('')
    setShowKeySection(false)
  }, [firmware?.path])

  if (!firmware) return null

  const isPaid = firmware.requireKey === true
  const accentColor = chipColors[firmware.chipFamily] || '#2997ff'
  const descriptionLines = (firmware.description || '').split('\n').filter(Boolean)
  const isLoading = loadingStatus === 'loading'
  const isError = loadingStatus === 'error'

  const verifyKey = async (key) => {
    setKeyVerifying(true)
    setKeyError('')
    try {
      const response = await fetch(
        `https://keymanager.congbang2709.workers.dev/verifyKey?key=${encodeURIComponent(key)}`,
        { method: 'GET', cache: 'no-cache' }
      )
      const result = await response.json()
      setKeyVerifying(false)
      return result.status === 'OK'
    } catch {
      setKeyVerifying(false)
      return false
    }
  }

  const handleActivateKey = async () => {
    if (!keyInput.trim()) return
    const valid = await verifyKey(keyInput.trim())
    if (valid) {
      setKeyActivated(true)
      setKeyError('')
    } else {
      setKeyError('Key không hợp lệ hoặc đã được sử dụng. Vui lòng kiểm tra lại.')
    }
  }

  // Determine which action button to show
  const renderAction = () => {
    // Case 1: Not connected
    if (!connected) {
      return (
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={connecting ? <CircularProgress size={18} color="inherit" /> : <UsbIcon />}
          onClick={connect}
          disabled={connecting}
          sx={{ minWidth: 180 }}
        >
          {connecting ? 'Đang kết nối...' : 'Kết Nối Thiết Bị'}
        </Button>
      )
    }

    // Case 2: Connected
    if (isPaid && !keyActivated) {
      // Case 2.2: Needs key
      return (
        <Button
          variant="contained"
          color="secondary"
          size="large"
          startIcon={<ShoppingCartIcon />}
          onClick={() => setShowKeySection(true)}
          sx={{ minWidth: 180 }}
        >
          Mua / Nhập Key
        </Button>
      )
    }

    // Case 2.1 or 2.3: Ready to flash
    return (
      <Button
        variant="contained"
        color="primary"
        size="large"
        startIcon={
          isLoading ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            <FlashOnIcon />
          )
        }
        onClick={() => onStartFlash(firmware)}
        disabled={isLoading || isError}
        sx={{ minWidth: 180 }}
      >
        {isLoading ? 'Đang tải FW...' : isError ? 'Lỗi tải FW' : 'Nạp FW'}
      </Button>
    )
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          position: 'relative',
          overflow: 'visible',
        },
      }}
    >
      {/* Close button */}
      <IconButton
        onClick={onClose}
        size="small"
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          color: 'text.secondary',
          zIndex: 1,
          '&:hover': { color: 'text.primary' },
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      <DialogTitle sx={{ pr: 5, pb: 1 }}>
        {/* Chip badge */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
          <Chip
            label={firmware.chipFamily}
            size="small"
            sx={{
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              background: `${accentColor}18`,
              color: accentColor,
              border: `1px solid ${accentColor}44`,
            }}
          />
          <Chip
            label={isPaid ? 'Có Phí' : 'Miễn Phí'}
            size="small"
            sx={{
              fontSize: '0.7rem',
              fontWeight: 700,
              background: isPaid ? 'rgba(255,82,82,0.15)' : 'rgba(0,230,118,0.15)',
              color: isPaid ? '#ff5252' : '#00e676',
              border: isPaid ? '1px solid rgba(255,82,82,0.3)' : '1px solid rgba(0,230,118,0.3)',
            }}
          />
        </Box>

        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontFamily: '"Roboto Mono", monospace',
            fontWeight: 700,
            fontSize: { xs: '1rem', sm: '1.1rem' },
            lineHeight: 1.3,
            color: 'text.primary',
          }}
        >
          {firmware.title}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Divider sx={{ mb: 2, borderColor: 'rgba(0,212,255,0.1)' }} />

        {/* Description */}
        <Box sx={{ mb: 2 }}>
          {descriptionLines.map((line, i) => (
            <DescriptionItem key={i} text={line} />
          ))}
        </Box>

        {/* YouTube link */}
        {firmware.youtube && firmware.youtube !== 'tobe' && (
          <Box sx={{ mb: 2 }}>
            <Link
              href={firmware.youtube}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.75,
                color: '#f44336',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 600,
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              <YouTubeIcon fontSize="small" />
              Xem video hướng dẫn
            </Link>
          </Box>
        )}

        {/* Connection status info when not connected */}
        {!connected && (
          <Alert
            severity="info"
            icon={<UsbIcon fontSize="inherit" />}
            sx={{ mb: 2, fontSize: '0.8rem' }}
          >
            {firmware.chipFamily === 'ESP32' ? (
              <>
                Cắm dây USB vào mạch ESP32. Giữ chặt nút <strong>BOOT</strong> (không thả ra), bấm <strong>Kết Nối Thiết Bị</strong>, đến khi kết nối thành công thì thả nút <strong>BOOT</strong> ra.
              </>
            ) : (
              <>
                Cắm dây USB vào mạch ESP32 rồi nhấn <strong>Kết Nối Thiết Bị</strong>. Không cần nhấn nút BOOT.
              </>
            )}
          </Alert>
        )}

        {/* Error loading firmware */}
        {isError && connected && (
          <Alert severity="error" sx={{ mb: 2, fontSize: '0.8rem' }}>
            Không tải được firmware. Vui lòng thử lại sau.
          </Alert>
        )}

        {/* Key section */}
        {isPaid && connected && !keyActivated && showKeySection && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 2,
              background: 'rgba(123,47,255,0.08)',
              border: '1px solid rgba(123,47,255,0.2)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <LockIcon sx={{ color: '#ffab40', fontSize: '1rem' }} />
              <Typography variant="body2" fontWeight={700} color="warning.main">
                Nhập key để mở khóa firmware
              </Typography>
            </Box>

            {/* Buy key info */}
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
              Chưa có key? Nhắn tin{' '}
              <Link
                href="https://facebook.com/share/1FL2bgyc7x/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: '#2997ff', fontWeight: 700 }}
              >
                <FacebookIcon sx={{ fontSize: '0.85rem', verticalAlign: 'middle', mr: 0.3 }} />
                Facebook
              </Link>{' '}
              để mua key (30.000đ) — mỗi key dùng 1 lần.
            </Typography>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                placeholder="Nhập key..."
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                disabled={keyVerifying}
                fullWidth
                onKeyDown={(e) => e.key === 'Enter' && handleActivateKey()}
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={handleActivateKey}
                disabled={keyVerifying || !keyInput.trim()}
                sx={{ minWidth: 110, flexShrink: 0 }}
              >
                {keyVerifying ? <CircularProgress size={18} color="inherit" /> : 'Kích hoạt'}
              </Button>
            </Box>
            {keyError && (
              <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.75 }}>
                {keyError}
              </Typography>
            )}
          </Box>
        )}

        {/* Key activated confirmation */}
        {isPaid && keyActivated && (
          <Box
            sx={{
              mt: 2,
              p: 1.5,
              borderRadius: 2,
              background: 'rgba(0,230,118,0.08)',
              border: '1px solid rgba(0,230,118,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <CheckCircleIcon sx={{ color: '#00e676', fontSize: '1rem' }} />
            <Typography variant="body2" color="success.main" fontWeight={600}>
              Key hợp lệ — sẵn sàng nạp firmware!
            </Typography>
            <LockOpenIcon sx={{ color: '#00e676', fontSize: '0.95rem', ml: 'auto' }} />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 0, justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        <Button
          variant="text"
          onClick={onClose}
          sx={{ color: 'text.secondary', minWidth: 80 }}
        >
          Đóng
        </Button>
        {renderAction()}
      </DialogActions>
    </Dialog>
  )
}

FirmwareModal.propTypes = {
  firmware: PropTypes.shape({
    title: PropTypes.string,
    chipFamily: PropTypes.string,
    youtube: PropTypes.string,
    requireKey: PropTypes.bool,
    description: PropTypes.string,
    path: PropTypes.string,
    address: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onStartFlash: PropTypes.func.isRequired,
  loadingStatus: PropTypes.string,
}

export default FirmwareModal
