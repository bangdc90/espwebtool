import React from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import YouTubeIcon from '@mui/icons-material/YouTube'
import PropTypes from 'prop-types'

// Per-chipFamily gradient palette for the thumbnail placeholder
const chipGradients = {
  ESP32S3: 'linear-gradient(135deg, #141420 0%, #1c2340 100%)',
  'ESP32-C3': 'linear-gradient(135deg, #1a1220 0%, #28183a 100%)',
  ESP32C3: 'linear-gradient(135deg, #1a1220 0%, #28183a 100%)',
  ESP32: 'linear-gradient(135deg, #101a14 0%, #182a1e 100%)',
}

const chipColors = {
  ESP32S3: '#2997ff',
  'ESP32-C3': '#9b7ff5',
  ESP32C3: '#9b7ff5',
  ESP32: '#34c759',
}

const FirmwareCard = ({ firmware, onClick }) => {
  const isPaid = firmware.requireKey === true
  const gradient = chipGradients[firmware.chipFamily] || chipGradients.ESP32
  const accentColor = chipColors[firmware.chipFamily] || '#2997ff'

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
      onClick={onClick}
    >
      {/* Free / Paid badge */}
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 2,
          px: 1,
          py: 0.25,
          borderRadius: 1,
          fontSize: '0.65rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          background: isPaid
            ? 'linear-gradient(135deg, #b71c1c, #d32f2f)'
            : 'linear-gradient(135deg, #1b5e20, #2e7d32)',
          color: '#fff',
          boxShadow: isPaid
            ? '0 0 8px rgba(255,82,82,0.4)'
            : '0 0 8px rgba(0,230,118,0.4)',
        }}
      >
        {isPaid ? 'Có Phí' : 'Miễn Phí'}
      </Box>

      <CardActionArea sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        {/* Thumbnail placeholder */}
        <Box
          sx={{
            height: 100,
            background: gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(circle at 50% 60%, ${accentColor}18 0%, transparent 70%)`,
            },
          }}
        >
          {/* Chip label as SVG-like glowing text in thumbnail */}
          <Typography
            sx={{
              fontFamily: '"Roboto Mono", monospace',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              color: accentColor,
              textShadow: `0 0 12px ${accentColor}`,
              zIndex: 1,
              opacity: 0.9,
            }}
          >
            {firmware.chipFamily}
          </Typography>
        </Box>

        <CardContent sx={{ flexGrow: 1, pt: 1.5, pb: '12px !important' }}>
          {/* ChipFamily badge */}
          <Chip
            label={firmware.chipFamily}
            size="small"
            sx={{
              mb: 1,
              height: 20,
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              background: `${accentColor}18`,
              color: accentColor,
              border: `1px solid ${accentColor}44`,
            }}
          />

          {/* Title */}
          <Typography
            variant="body2"
            component="h3"
            fontWeight={600}
            sx={{
              fontSize: '0.82rem',
              lineHeight: 1.35,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              color: 'text.primary',
              minHeight: '2.7em',
            }}
          >
            {firmware.title}
          </Typography>

          {/* YouTube hint */}
          {firmware.youtube && firmware.youtube !== 'tobe' && (
            <Box
              sx={{
                mt: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: 'rgba(255,255,255,0.35)',
              }}
            >
              <YouTubeIcon sx={{ fontSize: '0.85rem', color: '#f44336' }} />
              <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>
                Xem video hướng dẫn
              </Typography>
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

FirmwareCard.propTypes = {
  firmware: PropTypes.shape({
    title: PropTypes.string,
    chipFamily: PropTypes.string,
    youtube: PropTypes.string,
    requireKey: PropTypes.bool,
    description: PropTypes.string,
    path: PropTypes.string,
    address: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tab: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
}

export default FirmwareCard
