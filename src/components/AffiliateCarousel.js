import React, { useEffect, useState, useRef } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import LocalMallIcon from '@mui/icons-material/LocalMall'
import PropTypes from 'prop-types'

const CARD_WIDTH = 190
const CARD_GAP = 12
const SCROLL_AMOUNT = CARD_WIDTH + CARD_GAP

// ── Single product card — reads directly from JSON, no external API ──────────
const ProductCard = ({ product }) => (
  <Box
    component="a"
    href={product.url}
    target="_blank"
    rel="noopener noreferrer sponsored"
    sx={{
      flexShrink: 0,
      width: CARD_WIDTH,
      background: '#1d1d1f',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '10px',
      overflow: 'hidden',
      textDecoration: 'none',
      display: 'block',
      transition: 'border-color 0.2s, transform 0.2s',
      '&:hover': { borderColor: 'rgba(255,255,255,0.2)', transform: 'translateY(-2px)' },
    }}
  >
    {/* Thumbnail */}
    <Box sx={{ width: '100%', height: 150, background: '#2a2a2c', overflow: 'hidden', position: 'relative' }}>
      {product.image ? (
        <Box
          component="img"
          src={product.image}
          alt={product.title || 'Sản phẩm Shopee'}
          onError={e => { e.currentTarget.style.display = 'none' }}
          sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        /* Shopee-orange placeholder */
        <Box sx={{ width: '100%', height: '100%', background: '#ee4d2d', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
          <LocalMallIcon sx={{ color: '#fff', fontSize: 40, opacity: 0.9 }} />
          <Typography variant="caption" sx={{ color: '#fff', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.05em' }}>SHOPEE</Typography>
        </Box>
      )}
    </Box>

    {/* Title */}
    <Box sx={{ p: 1.2 }}>
      <Typography
        variant="caption"
        sx={{
          color: '#f5f5f7', fontWeight: 500,
          display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3,
          overflow: 'hidden', lineHeight: 1.4, fontSize: '0.72rem',
        }}
      >
        {product.title || 'Xem sản phẩm trên Shopee'}
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

// ── Carousel shell ───────────────────────────────────────────────────────────

const AffiliateCarousel = () => {
  const [products, setProducts] = useState([])
  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  useEffect(() => {
    fetch('/affiliate-products.json')
      .then(r => r.json())
      .then(data => setProducts(data))
      .catch(() => {})
  }, [])

  const updateScrollState = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }

  useEffect(() => { updateScrollState() }, [products])

  const scroll = (dir) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir * SCROLL_AMOUNT * 2, behavior: 'smooth' })
  }

  if (products.length === 0) return null

  return (
    <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.07)', py: 3, px: { xs: 2, md: 4 }, background: '#000' }}>
      {/* Heading */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 600, color: '#f5f5f7', letterSpacing: '-0.01em' }}>
            Mua linh kiện tại Shopee
          </Typography>
          <Typography variant="caption" sx={{ color: '#6e6e73' }}>
            Ủng hộ mình qua link tiếp thị nhé, cảm ơn bạn nhiều!
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton size="small" onClick={() => scroll(-1)} disabled={!canScrollLeft}
            sx={{ color: canScrollLeft ? '#f5f5f7' : '#3a3a3c', border: '1px solid', borderColor: canScrollLeft ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)', width: 32, height: 32 }}>
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => scroll(1)} disabled={!canScrollRight}
            sx={{ color: canScrollRight ? '#f5f5f7' : '#3a3a3c', border: '1px solid', borderColor: canScrollRight ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)', width: 32, height: 32 }}>
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Scrollable row */}
      <Box
        ref={scrollRef} onScroll={updateScrollState}
        sx={{ display: 'flex', gap: `${CARD_GAP}px`, overflowX: 'auto', overflowY: 'hidden', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' }, pb: 0.5 }}
      >
        {products.map(product => <ProductCard key={product.id} product={product} />)}
      </Box>
    </Box>
  )
}

export default AffiliateCarousel
