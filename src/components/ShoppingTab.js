import React, { useEffect, useState, useRef, useCallback } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import LocalMallIcon from '@mui/icons-material/LocalMall'
import PropTypes from 'prop-types'

const CARD_W = 180
const CARD_GAP = 12
const SCROLL_AMT = (CARD_W + CARD_GAP) * 2

// ── Single product card ────────────────────────────────────────────────────────
const ProductCard = ({ product }) => (
  <Box
    component="a"
    href={product.url}
    target="_blank"
    rel="noopener noreferrer sponsored"
    sx={{
      flexShrink: 0,
      width: { xs: 148, sm: CARD_W },
      background: '#1d1d1f',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '10px',
      overflow: 'hidden',
      textDecoration: 'none',
      display: 'block',
      transition: 'border-color 0.2s, transform 0.2s',
      '&:hover': {
        borderColor: 'rgba(255, 108, 0, 0.45)',
        transform: 'translateY(-2px)',
      },
    }}
  >
    {/* Thumbnail */}
    <Box
      sx={{
        width: '100%',
        height: { xs: 120, sm: 148 },
        background: '#2a2a2c',
        overflow: 'hidden',
      }}
    >
      {product.image ? (
        <Box
          component="img"
          src={product.image}
          alt={product.title || 'Sản phẩm'}
          onError={(e) => { e.currentTarget.style.display = 'none' }}
          sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            background: '#BF360C',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LocalMallIcon sx={{ color: '#fff', fontSize: 36, opacity: 0.85 }} />
        </Box>
      )}
    </Box>

    {/* Title */}
    <Box sx={{ p: 1.2 }}>
      <Typography
        variant="caption"
        sx={{
          color: '#f5f5f7',
          fontWeight: 500,
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 3,
          overflow: 'hidden',
          lineHeight: 1.45,
          fontSize: '0.72rem',
        }}
      >
        {product.title || 'Xem sản phẩm'}
      </Typography>
    </Box>
  </Box>
)

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number,
    url: PropTypes.string.isRequired,
    title: PropTypes.string,
    image: PropTypes.string,
  }).isRequired,
}

// ── Per-category carousel ────────────────────────────────────────────────────────
const CategoryCarousel = ({ category }) => {
  const scrollRef = useRef(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)

  // Mouse-drag state refs (no re-render needed)
  const isDragging = useRef(false)
  const didDrag = useRef(false)
  const dragStartX = useRef(0)
  const dragScrollLeft = useRef(0)
  const DRAG_THRESHOLD = 5 // px — below this is treated as a real click

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })
    return () => el.removeEventListener('scroll', updateScrollState)
  }, [updateScrollState, category.products])

  const scroll = (dir) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir * SCROLL_AMT, behavior: 'smooth' })
  }

  // ── Mouse drag handlers (desktop) ────────────────────────────────────────────
  // Global move/up are attached to window so drag works outside the element bounds.
  const handleMouseMove = useCallback((e) => {
    if (!isDragging.current) return
    const el = scrollRef.current
    if (!el) return
    const delta = e.clientX - dragStartX.current
    if (Math.abs(delta) > DRAG_THRESHOLD) didDrag.current = true
    el.scrollLeft = dragScrollLeft.current - delta
  }, [])

  const handleMouseUp = useCallback(() => {
    if (!isDragging.current) return
    isDragging.current = false
    const el = scrollRef.current
    if (el) {
      el.style.cursor = 'grab'
      el.style.userSelect = ''
    }
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)

    // If user actually dragged, swallow the click that fires right after mouseup
    if (didDrag.current) {
      const suppressClick = (e) => {
        e.stopPropagation()
        e.preventDefault()
        window.removeEventListener('click', suppressClick, true)
      }
      window.addEventListener('click', suppressClick, true) // capture phase
    }
    didDrag.current = false
  }, [handleMouseMove])

  const handleMouseDown = useCallback((e) => {
    // Only respond to left button
    if (e.button !== 0) return
    const el = scrollRef.current
    if (!el) return
    e.preventDefault()  // prevent browser native drag / text-select
    isDragging.current = true
    didDrag.current = false
    dragStartX.current = e.clientX
    dragScrollLeft.current = el.scrollLeft
    el.style.cursor = 'grabbing'
    el.style.userSelect = 'none'
    // Attach to window so we receive events even when cursor leaves the element
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }, [handleMouseMove, handleMouseUp])

  if (!category.products?.length) return null

  return (
    <Box sx={{ mb: 4 }}>
      {/* Category heading row */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1.5,
          px: { xs: 2, md: 4 },
        }}
      >
        <Box>
          <Typography
            variant="body1"
            sx={{ fontWeight: 700, color: '#FF8C00', letterSpacing: '-0.01em' }}
          >
            {category.label}
          </Typography>
          <Typography variant="caption" sx={{ color: '#6e6e73' }}>
            {category.labelEn}
          </Typography>
        </Box>

        {/* Arrow buttons — desktop only */}
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={() => scroll(-1)}
            disabled={!canLeft}
            sx={{
              color: canLeft ? '#f5f5f7' : '#3a3a3c',
              border: '1px solid',
              borderColor: canLeft ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
              width: 32,
              height: 32,
            }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => scroll(1)}
            disabled={!canRight}
            sx={{
              color: canRight ? '#f5f5f7' : '#3a3a3c',
              border: '1px solid',
              borderColor: canRight ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
              width: 32,
              height: 32,
            }}
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Scrollable cards row — touch-swipe on mobile, mouse-drag + arrows on desktop */}
      <Box
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        sx={{
          display: 'flex',
          gap: `${CARD_GAP}px`,
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          pb: 1,
          px: { xs: 2, md: 4 },
          WebkitOverflowScrolling: 'touch',
          cursor: 'grab',
          '&:active': { cursor: 'grabbing' },
        }}
      >
        {category.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Box>
    </Box>
  )
}

CategoryCarousel.propTypes = {
  category: PropTypes.shape({
    category: PropTypes.string,
    label: PropTypes.string.isRequired,
    labelEn: PropTypes.string,
    products: PropTypes.array.isRequired,
  }).isRequired,
}

// ── Main shopping tab panel ────────────────────────────────────────────────────
const ShoppingTab = () => {
  const [groups, setGroups] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch('/affiliate-products.json')
      .then((r) => r.json())
      .then((data) => {
        // Support both new grouped format and legacy flat array
        if (Array.isArray(data) && data.length > 0 && data[0].products) {
          setGroups(data)
        } else {
          // Legacy: wrap everything in a single "Sản phẩm" group
          setGroups([{ category: 'all', label: 'Sản phẩm', labelEn: 'Products', products: data }])
        }
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [])

  return (
    <Box sx={{ pt: 3, pb: 6 }}>
      {/* Sub-header */}
      <Box sx={{ px: { xs: 2, md: 4 }, mb: 3 }}>
        <Typography variant="body2" sx={{ color: '#6e6e73' }}>
          Ủng hộ mình qua link tiếp thị nhé, cảm ơn bạn nhiều! 🙏
        </Typography>
      </Box>

      {/* Category carousels */}
      {groups.map((group) => (
        <CategoryCarousel key={group.category} category={group} />
      ))}

      {/* Empty state */}
      {loaded && groups.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 10,
            color: '#3a3a3c',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <LocalMallIcon sx={{ fontSize: 52 }} />
          <Typography variant="body2">Chưa có sản phẩm nào</Typography>
        </Box>
      )}
    </Box>
  )
}

export default ShoppingTab
