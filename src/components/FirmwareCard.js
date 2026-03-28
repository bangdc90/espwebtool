import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import YouTubeIcon from '@mui/icons-material/YouTube'
import PropTypes from 'prop-types'

// Extract YouTube video ID and build thumbnail URL
const getYtThumbnail = (url) => {
  if (!url || url === 'tobe') return null
  const m =
    url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/) ||
    url.match(/youtube\.com\/(?:watch\?v=|shorts\/|embed\/)([a-zA-Z0-9_-]{11})/)
  return m ? `https://img.youtube.com/vi/${m[1]}/mqdefault.jpg` : null
}

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
  const ytThumb = getYtThumbnail(firmware.youtube)
  const [thumbError, setThumbError] = useState(false)
  const showThumb = ytThumb && !thumbError

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
        {/* 16:9 Thumbnail */}
        <Box sx={{ position: 'relative', width: '100%', paddingTop: '56.25%', overflow: 'hidden', background: gradient }}>
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {showThumb ? (
              <Box
                component="img"
                src={ytThumb}
                alt={firmware.title}
                onError={() => setThumbError(true)}
                sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <>
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(circle at 50% 60%, ${accentColor}18 0%, transparent 70%)`,
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: '"Roboto Mono", monospace',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    color: accentColor,
                    textShadow: `0 0 14px ${accentColor}`,
                    zIndex: 1,
                  }}
                >
                  {firmware.chipFamily}
                </Typography>
              </>
            )}
          </Box>
        </Box>

        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', pt: 1.2, pb: '10px !important', px: 1.5 }}>
          {/* ChipFamily badge */}
          <Chip
            label={firmware.chipFamily}
            size="small"
            sx={{
              alignSelf: 'flex-start',
              mb: 0.75,
              height: 18,
              fontSize: '0.62rem',
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
              flexGrow: 1,
              fontSize: '0.8rem',
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              color: 'text.primary',
            }}
          >
            {firmware.title}
          </Typography>

          {/* YouTube hint */}
          {firmware.youtube && firmware.youtube !== 'tobe' && (
            <Box
              sx={{
                mt: 0.75,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <YouTubeIcon sx={{ fontSize: '0.85rem', color: '#f44336' }} />
              <Typography sx={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1 }}>
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
