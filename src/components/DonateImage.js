import React from 'react'
import Box from '@mui/material/Box'

const DonateImage = () => {
    return (
        <Box
            sx={{
                position: 'fixed',
                top: '64px', // Dưới AppBar (chỉ cho desktop)
                right: '16px',
                zIndex: 1000,
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                padding: '4px',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                },
                // Chỉ hiển thị trên máy tính, ẩn trên mobile và tablet
                display: { xs: 'none', sm: 'none', md: 'block' },
            }}
        >
            <Box
                component="img"
                src="/donate.jpg"
                alt="Donate"
                sx={{
                    width: '300px', // Tăng kích thước lên 300px cho desktop
                    height: 'auto',
                    borderRadius: '4px',
                    display: 'block'
                }}
            />
        </Box>
    )
}

export default DonateImage
