import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const Header = (props) => {
    const [totalVisits, setTotalVisits] = useState(0);
    const [todayVisits, setTodayVisits] = useState(0);

    const updateStateFromData = (data) => {
        if (data.totalVisits !== undefined) setTotalVisits(data.totalVisits);
        if (data.todayVisits !== undefined) setTodayVisits(data.todayVisits);
    };

    const fetchGetVisits = async () => {
        try {
            const res = await fetch("https://visitor-counter.congbang2709.workers.dev/get");
            const data = await res.json();
            updateStateFromData(data);
        } catch (err) {
            console.error("Error fetching visit count (get):", err);
        }
    };

    const fetchUpdateVisits = async () => {
        try {
            const res = await fetch("https://visitor-counter.congbang2709.workers.dev/update");
            const data = await res.json();

            if (data.message && data.message.includes("Too frequent")) {
                await fetchGetVisits();
                return;
            }
            updateStateFromData(data);
        } catch (err) {
            console.error("Error fetching visit count (update):", err);
            await fetchGetVisits();
        }
    };

    useEffect(() => {
        // Lấy dữ liệu ngay khi component mount
        fetchGetVisits();

        // Khi trang load xong thì update
        const handlePageLoad = () => {
            fetchUpdateVisits();
        };

        if (document.readyState === "complete") {
            handlePageLoad();
        } else {
            window.addEventListener("load", handlePageLoad);
            return () => window.removeEventListener("load", handlePageLoad);
        }
    }, []);

    return (
        <AppBar
            position='static'
            sx={{
                ...props.sx,
                background: '#0276aa',
            }}
        >
            <Toolbar>
                <Typography
                    variant='h6'
                    component='h1'
                    noWrap
                    sx={{ 
                        fontFamily: 'Roboto, Arial, sans-serif',
                    }}
                >
                    Mr Vọc Sĩ
                </Typography>
                <Box sx={{ marginLeft: 'auto', display: 'flex', gap: 2 }}>
                    <Typography variant="body2">
                        Today: {todayVisits}
                    </Typography>
                    <Typography variant="body2">
                        Total: {totalVisits}
                    </Typography>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

Header.propTypes = {
    sx: PropTypes.object,
};

export default Header;
