import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import SettingsIcon from '@mui/icons-material/Settings';
import UsbIcon from '@mui/icons-material/Usb';
import UsbOffIcon from '@mui/icons-material/UsbOff';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';

import { useConnection } from '../context/ConnectionContext';
import avatarImg from '../icons/avatar.jpg';

const Header = ({ onOpenSettings, flashing }) => {
    const { connected, connecting, chipName, connect, supported } = useConnection();
    const [totalVisits, setTotalVisits] = useState(0);
    const [todayVisits, setTodayVisits] = useState(0);

    const updateStateFromData = (data) => {
        if (data.totalVisits !== undefined) setTotalVisits(data.totalVisits);
        if (data.todayVisits !== undefined) setTodayVisits(data.todayVisits);
    };

    const fetchGetVisits = async () => {
        try {
            const res = await fetch('https://visitor-counter.congbang2709.workers.dev/get');
            const data = await res.json();
            updateStateFromData(data);
        } catch (err) {
            console.error('Error fetching visit count:', err);
        }
    };

    const fetchUpdateVisits = async () => {
        try {
            const res = await fetch('https://visitor-counter.congbang2709.workers.dev/update');
            const data = await res.json();
            if (data.message && data.message.includes('Too frequent')) {
                await fetchGetVisits();
                return;
            }
            updateStateFromData(data);
        } catch (err) {
            await fetchGetVisits();
        }
    };

    useEffect(() => {
        fetchGetVisits();
        const handleLoad = () => fetchUpdateVisits();
        if (document.readyState === 'complete') {
            handleLoad();
        } else {
            window.addEventListener('load', handleLoad);
            return () => window.removeEventListener('load', handleLoad);
        }
    }, []);

    const handleConnect = async () => {
        if (!supported()) return;
        await connect();
    };

    return (
        <AppBar position="sticky" elevation={0}>
            <Toolbar sx={{ gap: 1, minHeight: { xs: 56, sm: 64 } }}>
                {/* Circular avatar + Logo + Social links — all same baseline */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                    <Box
                        component="img"
                        src={avatarImg}
                        alt="Mr Vọc Sĩ"
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2px solid rgba(255,255,255,0.15)',
                        }}
                    />
                    <Typography
                        variant="h6"
                        component="h1"
                        noWrap
                        sx={{
                            fontWeight: 700,
                            letterSpacing: '-0.01em',
                            color: '#f5f5f7',
                        }}
                    >
                        Mr Vọc Sĩ
                    </Typography>

                    {/* Divider */}
                    <Box sx={{ width: '1px', height: 20, background: 'rgba(255,255,255,0.15)', mx: 0.5 }} />

                    {/* Facebook */}
                    <Box
                        component="a"
                        href="https://www.facebook.com/share/1CCjN9zD9G/?mibextid=wwXIfr"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            color: 'rgba(255,255,255,0.5)',
                            textDecoration: 'none',
                            transition: 'color 0.2s',
                            '&:hover': { color: '#1877F2' },
                        }}
                    >
                        <FacebookIcon sx={{ fontSize: '1.25rem' }} />
                        <Box
                            component="span"
                            sx={{
                                display: { xs: 'none', sm: 'inline' },
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                letterSpacing: '-0.01em',
                            }}
                        >
                            Fanpage
                        </Box>
                    </Box>

                    {/* YouTube */}
                    <Box
                        component="a"
                        href="http://youtube.com/@mrvocsi"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            color: 'rgba(255,255,255,0.5)',
                            textDecoration: 'none',
                            transition: 'color 0.2s',
                            '&:hover': { color: '#FF0000' },
                        }}
                    >
                        <YouTubeIcon sx={{ fontSize: '1.25rem' }} />
                        <Box
                            component="span"
                            sx={{
                                display: { xs: 'none', sm: 'inline' },
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                letterSpacing: '-0.01em',
                            }}
                        >
                            YouTube
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                {/* Visitor counter — hide on xs */}
                <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1.5, mr: 1 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: '"Roboto Mono", monospace' }}>
                        Hôm nay: <strong style={{ color: '#2997ff' }}>{todayVisits}</strong>
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: '"Roboto Mono", monospace' }}>
                        Tổng: <strong style={{ color: '#2997ff' }}>{totalVisits}</strong>
                    </Typography>
                </Box>

                {/* Connection status */}
                {connected && (
                    <Chip
                        icon={<FiberManualRecordIcon sx={{ fontSize: '0.65rem !important', color: '#00e676 !important' }} />}
                        label={chipName || 'Connected'}
                        size="small"
                        onClick={handleConnect}
                        sx={{
                            bgcolor: 'rgba(0,230,118,0.1)',
                            color: '#00e676',
                            border: '1px solid rgba(0,230,118,0.3)',
                            fontFamily: '"Roboto Mono", monospace',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            '&:hover': { bgcolor: 'rgba(0,230,118,0.18)' },
                        }}
                    />
                )}

                {/* Connect button */}
                {!connected && (
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={
                            connecting
                                ? <CircularProgress size={14} color="inherit" />
                                : <UsbIcon fontSize="small" />
                        }
                        onClick={handleConnect}
                        disabled={connecting || flashing || !supported()}
                        sx={{ flexShrink: 0, fontSize: '0.8rem', px: 1.5 }}
                    >
                        {connecting ? 'Đang kết nối...' : 'Kết Nối'}
                    </Button>
                )}

                {/* Disconnect button when connected */}
                {connected && (
                    <Tooltip title="Ngắt kết nối">
                        <IconButton
                            size="small"
                            onClick={handleConnect}
                            disabled={flashing}
                            sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
                        >
                            <UsbOffIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}

                {/* Settings */}
                {onOpenSettings && (
                    <Tooltip title="Cài đặt">
                        <IconButton
                            size="small"
                            onClick={onOpenSettings}
                            sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                        >
                            <SettingsIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
            </Toolbar>
        </AppBar>
    );
};

Header.propTypes = {
    onOpenSettings: PropTypes.func,
    flashing: PropTypes.bool,
};

export default Header;

