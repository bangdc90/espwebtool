import React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import PropTypes from 'prop-types'

/**
 * TabBar — extensible tab navigation.
 * Props:
 *   tabs: Array<{ id: string, label: string, icon?: ReactNode, tabSx?: object }>
 *   activeTab: string
 *   onChange: (tabId: string) => void
 *   stickyTop: number  — top offset for sticky positioning (default 64)
 */
const TabBar = ({ tabs, activeTab, onChange, stickyTop = 64 }) => {
  const activeIndex = tabs.findIndex((t) => t.id === activeTab)

  return (
    <Box
      sx={{
        borderBottom: '1px solid rgba(0,212,255,0.15)',
        mb: 3,
        position: 'sticky',
        top: stickyTop,
        zIndex: 10,
        background: 'rgba(10,10,15,0.9)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <Tabs
        value={activeIndex === -1 ? 0 : activeIndex}
        onChange={(_, idx) => onChange(tabs[idx]?.id)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ px: { xs: 1, md: 4 } }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            label={tab.label}
            icon={tab.icon}
            iconPosition={tab.icon ? 'start' : undefined}
            sx={tab.tabSx}
          />
        ))}
      </Tabs>
    </Box>
  )
}

TabBar.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      icon: PropTypes.node,
      tabSx: PropTypes.object,
    })
  ).isRequired,
  activeTab: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  stickyTop: PropTypes.number,
}

export default TabBar
