import React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import PropTypes from 'prop-types'

/**
 * TabBar — extensible tab navigation.
 * Props:
 *   tabs: Array<{ id: string, label: string }>
 *   activeTab: string
 *   onChange: (tabId: string) => void
 */
const TabBar = ({ tabs, activeTab, onChange }) => {
  const activeIndex = tabs.findIndex((t) => t.id === activeTab)

  return (
    <Box
      sx={{
        borderBottom: '1px solid rgba(0,212,255,0.15)',
        mb: 3,
        position: 'sticky',
        top: 64,
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
          <Tab key={tab.id} label={tab.label} />
        ))}
      </Tabs>
    </Box>
  )
}

TabBar.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string, label: PropTypes.string })).isRequired,
  activeTab: PropTypes.string,
  onChange: PropTypes.func.isRequired,
}

export default TabBar
