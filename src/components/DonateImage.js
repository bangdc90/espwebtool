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
                overflow: 'visible',
                // Chỉ hiển thị trên máy tính, ẩn trên mobile và tablet
                display: { xs: 'none', sm: 'none', md: 'block' },
                
                // Hiệu ứng khói cafe
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-20px',
                    left: '20%',
                    width: '8px',
                    height: '40px',
                    background: 'linear-gradient(to top, rgba(139, 69, 19, 0.6), rgba(139, 69, 19, 0.3), rgba(139, 69, 19, 0.1), transparent)',
                    borderRadius: '50%',
                    opacity: 0,
                    transform: 'translateY(10px)',
                    transition: 'all 0.3s ease',
                    animation: 'none',
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '-25px',
                    right: '20%',
                    width: '6px',
                    height: '35px',
                    background: 'linear-gradient(to top, rgba(160, 82, 45, 0.5), rgba(160, 82, 45, 0.2), transparent)',
                    borderRadius: '50%',
                    opacity: 0,
                    transform: 'translateY(15px)',
                    transition: 'all 0.4s ease 0.1s',
                    animation: 'none',
                },
                
                '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                    
                    '&::before': {
                        opacity: 1,
                        transform: 'translateY(-20px)',
                        animation: 'smoke1 2s ease-in-out infinite',
                    },
                    '&::after': {
                        opacity: 1,
                        transform: 'translateY(-30px)',
                        animation: 'smoke2 2.5s ease-in-out infinite 0.3s',
                    }
                },
                
                // Keyframes cho animation khói
                '@keyframes smoke1': {
                    '0%': {
                        opacity: 0.6,
                        transform: 'translateY(-10px) translateX(0px) scale(1)',
                    },
                    '25%': {
                        opacity: 0.8,
                        transform: 'translateY(-25px) translateX(3px) scale(1.1)',
                    },
                    '50%': {
                        opacity: 0.6,
                        transform: 'translateY(-40px) translateX(-2px) scale(1.2)',
                    },
                    '75%': {
                        opacity: 0.4,
                        transform: 'translateY(-55px) translateX(4px) scale(1.3)',
                    },
                    '100%': {
                        opacity: 0,
                        transform: 'translateY(-70px) translateX(-1px) scale(1.4)',
                    }
                },
                '@keyframes smoke2': {
                    '0%': {
                        opacity: 0.5,
                        transform: 'translateY(-15px) translateX(0px) scale(0.8)',
                    },
                    '30%': {
                        opacity: 0.7,
                        transform: 'translateY(-30px) translateX(-3px) scale(1)',
                    },
                    '60%': {
                        opacity: 0.5,
                        transform: 'translateY(-45px) translateX(2px) scale(1.1)',
                    },
                    '80%': {
                        opacity: 0.3,
                        transform: 'translateY(-60px) translateX(-2px) scale(1.2)',
                    },
                    '100%': {
                        opacity: 0,
                        transform: 'translateY(-75px) translateX(1px) scale(1.3)',
                    }
                }
            }}
        >
            <Box
                component="img"
                src="/donate.jpg"
                alt="Donate"
                sx={{
                    width: '220px', // Tăng kích thước lên 220px cho desktop
                    height: 'auto',
                    borderRadius: '4px',
                    display: 'block'
                }}
            />
        </Box>
    )
}

export default DonateImage
