import React from 'react'
import Box from '@mui/material/Box'

const DonateImage = () => {
    // Tạo 6 cột khói với các thuộc tính khác nhau
    const smokeColumns = [
        { left: '15%', delay: '0s', duration: '2.5s', width: '6px', height: '45px' },
        { left: '25%', delay: '0.3s', duration: '3s', width: '8px', height: '50px' },
        { left: '35%', delay: '0.6s', duration: '2.2s', width: '7px', height: '42px' },
        { left: '50%', delay: '0.2s', duration: '2.8s', width: '9px', height: '48px' },
        { left: '65%', delay: '0.8s', duration: '3.2s', width: '6px', height: '40px' },
        { left: '78%', delay: '0.5s', duration: '2.6s', width: '7px', height: '46px' },
    ];

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
                
                '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                    
                    '& .smoke-column': {
                        opacity: 1,
                        animation: 'smokeRise 3s ease-in-out infinite',
                    }
                },
                
                // Keyframes cho animation khói
                '@keyframes smokeRise': {
                    '0%': {
                        opacity: 0.7,
                        transform: 'translateY(0px) translateX(0px) scale(0.8) rotate(0deg)',
                    },
                    '15%': {
                        opacity: 0.8,
                        transform: 'translateY(-15px) translateX(2px) scale(0.9) rotate(5deg)',
                    },
                    '30%': {
                        opacity: 0.9,
                        transform: 'translateY(-30px) translateX(-3px) scale(1) rotate(-3deg)',
                    },
                    '45%': {
                        opacity: 0.7,
                        transform: 'translateY(-45px) translateX(4px) scale(1.1) rotate(8deg)',
                    },
                    '60%': {
                        opacity: 0.5,
                        transform: 'translateY(-60px) translateX(-2px) scale(1.2) rotate(-5deg)',
                    },
                    '75%': {
                        opacity: 0.3,
                        transform: 'translateY(-75px) translateX(3px) scale(1.3) rotate(7deg)',
                    },
                    '90%': {
                        opacity: 0.1,
                        transform: 'translateY(-90px) translateX(-1px) scale(1.4) rotate(-2deg)',
                    },
                    '100%': {
                        opacity: 0,
                        transform: 'translateY(-105px) translateX(2px) scale(1.5) rotate(3deg)',
                    }
                }
            }}
        >
            {/* Tạo các cột khói */}
            {smokeColumns.map((smoke, index) => (
                <Box
                    key={index}
                    className="smoke-column"
                    sx={{
                        position: 'absolute',
                        top: '-30px',
                        left: smoke.left,
                        width: smoke.width,
                        height: smoke.height,
                        background: `linear-gradient(to top, 
                            rgba(139, 69, 19, ${0.6 - index * 0.05}), 
                            rgba(160, 82, 45, ${0.4 - index * 0.03}), 
                            rgba(210, 180, 140, ${0.2 - index * 0.02}), 
                            transparent)`,
                        borderRadius: '50%',
                        opacity: 0,
                        transform: 'translateY(20px)',
                        transition: `all 0.3s ease ${smoke.delay}`,
                        animation: 'none',
                        animationDelay: smoke.delay,
                        animationDuration: smoke.duration,
                        filter: 'blur(0.5px)',
                    }}
                />
            ))}
            
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
