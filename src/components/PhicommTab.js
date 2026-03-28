import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Collapse from '@mui/material/Collapse'

import SpeakerIcon from '@mui/icons-material/Speaker'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import RadioIcon from '@mui/icons-material/Radio'
import SearchIcon from '@mui/icons-material/Search'
import HomeIcon from '@mui/icons-material/Home'
import BluetoothIcon from '@mui/icons-material/Bluetooth'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import LoopIcon from '@mui/icons-material/Loop'
import DownloadIcon from '@mui/icons-material/Download'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import FacebookIcon from '@mui/icons-material/Facebook'
import YouTubeIcon from '@mui/icons-material/YouTube'

import loaImg from '../icons/loa-phicomm.jpg'
import PropTypes from 'prop-types'

// ─── Reusable sub-components ─────────────────────────────────────────────────

const SectionCard = ({ children, sx = {} }) => (
  <Box
    sx={{
      background: '#1d1d1f',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '12px',
      p: { xs: 2, md: 3 },
      mb: 2.5,
      ...sx,
    }}
  >
    {children}
  </Box>
)
SectionCard.propTypes = { children: PropTypes.node, sx: PropTypes.object }

const SectionTitle = ({ children }) => (
  <Typography
    variant="h6"
    sx={{
      fontWeight: 700,
      color: '#f5f5f7',
      mb: 2,
      fontSize: { xs: '1rem', md: '1.1rem' },
      letterSpacing: '-0.01em',
    }}
  >
    {children}
  </Typography>
)
SectionTitle.propTypes = { children: PropTypes.node }

/** Blue-accent feature block (main feature row) */
const FeatureBlock = ({ icon: Icon, title, children }) => (
  <Box
    sx={{
      borderLeft: '3px solid #2997ff',
      pl: 2,
      mb: 2,
      '&:last-child': { mb: 0 },
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
      {Icon && <Icon sx={{ fontSize: '1rem', color: '#2997ff', flexShrink: 0 }} />}
      <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#f5f5f7' }}>
        {title}
      </Typography>
    </Box>
    {children && (
      <Typography sx={{ fontSize: '0.8rem', color: '#6e6e73', lineHeight: 1.6 }}>
        {children}
      </Typography>
    )}
  </Box>
)
FeatureBlock.propTypes = { icon: PropTypes.elementType, title: PropTypes.string, children: PropTypes.node }

/** Indented sub-feature row */
const SubFeature = ({ title, children }) => (
  <Box
    sx={{
      ml: 2,
      mt: 1.5,
      pl: 1.5,
      borderLeft: '2px solid rgba(41,151,255,0.3)',
    }}
  >
    <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#2997ff', mb: 0.3 }}>
      {title}
    </Typography>
    <Typography sx={{ fontSize: '0.78rem', color: '#6e6e73', lineHeight: 1.55 }}>
      {children}
    </Typography>
  </Box>
)
SubFeature.propTypes = { title: PropTypes.string, children: PropTypes.node }

/** Update / changelog item */
const ChangelogItem = ({ children }) => (
  <Box sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
    <Typography sx={{ fontSize: '0.78rem', color: '#34c759', flexShrink: 0 }}>✓</Typography>
    <Typography sx={{ fontSize: '0.78rem', color: '#6e6e73', lineHeight: 1.55 }}>{children}</Typography>
  </Box>
)
ChangelogItem.propTypes = { children: PropTypes.node }

// ─── Main component ───────────────────────────────────────────────────────────

const PhicommTab = () => {
  const [roleExpanded, setRoleExpanded] = useState(false)

  return (
    <Box sx={{ pt: 2, pb: 6, px: { xs: 2, md: 4 }, maxWidth: 1100, mx: 'auto' }}>

      {/* ── Hero image ────────────────────────────────────────────────────── */}
      <Box
        sx={{
          borderRadius: '12px',
          overflow: 'hidden',
          mb: 2.5,
          border: '1px solid rgba(255,255,255,0.07)',
          position: 'relative',
        }}
      >
        <Box
          component="img"
          src={loaImg}
          alt="Loa Phicomm AI"
          sx={{
            width: '100%',
            display: 'block',
            objectFit: 'cover',
            maxHeight: { xs: 200, sm: 280, md: 340 },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            px: 2,
            py: 1.5,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.78))',
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: '#f5f5f7', fontSize: { xs: '1.1rem', sm: '1.4rem' }, letterSpacing: '-0.01em' }}
          >
            Loa AI Phicomm R1
          </Typography>
          <Typography sx={{ fontSize: '0.8rem', color: 'rgba(245,245,247,0.65)' }}>
            Biến loa thường thành trợ lý AI thông minh
          </Typography>
        </Box>
      </Box>

      {/* ── Action cards — 4 cols on md, 2 on sm, 1 on xs ────────────────── */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 2,
          mb: 2.5,
          alignItems: 'stretch',
        }}
      >
        {/* Mua loa */}
        <SectionCard sx={{ mb: 0, display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
          <Typography sx={{ fontWeight: 700, color: '#f5f5f7', mb: 0.75, fontSize: '0.9rem' }}>
            Mua loa đã cài AI
          </Typography>
          <Typography sx={{ fontSize: '0.78rem', color: '#6e6e73', lineHeight: 1.55, flexGrow: 1, mb: 2 }}>
            Cài sẵn phần mềm, chỉ cần cấu hình wifi. Không cần kích hoạt key.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="small"
              component="a"
              href="https://s.shopee.vn/5L4h8Qakvw"
              target="_blank"
              rel="noopener noreferrer"
              endIcon={<OpenInNewIcon fontSize="small" />}
              sx={{
                background: 'linear-gradient(135deg, #E65100, #FF8F00)',
                color: '#fff',
                fontWeight: 600,
                borderRadius: '8px',
                textTransform: 'none',
                '&:hover': { background: 'linear-gradient(135deg, #BF360C, #E65100)' },
              }}
            >
              Mua trên Shopee
            </Button>
          </Box>
        </SectionCard>

        {/* Tải phần mềm */}
        <SectionCard sx={{ mb: 0, display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0.75 }}>
            <Chip
              label="V2.0.6.7 — 31/01/2026"
              size="small"
              sx={{
                fontSize: '0.62rem',
                fontWeight: 700,
                background: 'rgba(52,199,89,0.1)',
                color: '#34c759',
                border: '1px solid rgba(52,199,89,0.3)',
              }}
            />
          </Box>
          <Typography sx={{ fontWeight: 700, color: '#f5f5f7', mb: 0.75, fontSize: '0.9rem' }}>
            Tải phần mềm
          </Typography>
          <Typography sx={{ fontSize: '0.78rem', color: '#6e6e73', lineHeight: 1.55, flexGrow: 1, mb: 2 }}>
            Donate 150K / KEY kích hoạt. Xem video hướng dẫn trước khi cài.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              size="small"
              component="a"
              href="https://github.com/bangdc90/cai_dat_ai/archive/refs/heads/main.zip"
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<DownloadIcon />}
              sx={{
                color: '#2997ff',
                borderColor: 'rgba(41,151,255,0.4)',
                fontWeight: 600,
                borderRadius: '8px',
                textTransform: 'none',
                '&:hover': { background: 'rgba(41,151,255,0.08)', borderColor: '#2997ff' },
              }}
            >
              Tải về ngay
            </Button>
          </Box>
        </SectionCard>

        {/* Video hướng dẫn */}
        <SectionCard sx={{ mb: 0, display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
          <Typography sx={{ fontWeight: 700, color: '#f5f5f7', mb: 0.75, fontSize: '0.9rem' }}>
            Video hướng dẫn
          </Typography>
          <Typography sx={{ fontSize: '0.78rem', color: '#6e6e73', lineHeight: 1.55, flexGrow: 1, mb: 2 }}>
            Cài mới hoặc nâng cấp — chỉ 5 phút.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
            <Button
              variant="outlined"
              size="small"
              component="a"
              href="https://youtu.be/SGQ5NjFsx_A"
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<PlayCircleIcon />}
              sx={{
                width: '100%',
                color: '#ff453a',
                borderColor: 'rgba(255,69,58,0.4)',
                fontWeight: 600,
                borderRadius: '8px',
                textTransform: 'none',
                '&:hover': { borderColor: '#ff453a', background: 'rgba(255,69,58,0.07)' },
              }}
            >
              Cài đặt từ đầu
            </Button>
            <Button
              variant="outlined"
              size="small"
              component="a"
              href="https://youtu.be/SGQ5NjFsx_A?t=555"
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<PlayCircleIcon />}
              sx={{
                width: '100%',
                color: '#ff453a',
                borderColor: 'rgba(255,69,58,0.4)',
                fontWeight: 600,
                borderRadius: '8px',
                textTransform: 'none',
                '&:hover': { borderColor: '#ff453a', background: 'rgba(255,69,58,0.07)' },
              }}
            >
              Cập nhật phần mềm
            </Button>
          </Box>
        </SectionCard>

        {/* KEY kích hoạt */}
        <SectionCard sx={{ mb: 0, display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
          <Typography sx={{ fontWeight: 700, color: '#f5f5f7', mb: 0.75, fontSize: '0.9rem' }}>
            KEY kích hoạt
          </Typography>
          <Typography sx={{ fontSize: '0.78rem', color: '#6e6e73', lineHeight: 1.55, flexGrow: 1, mb: 2 }}>
            Phần mềm cần KEY sau khi cài (Donate 150K). Liên hệ FB để được hỗ trợ.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="small"
              component="a"
              href="https://www.facebook.com/profile.php?id=61581220204083"
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<FacebookIcon />}
              sx={{
                background: '#1877F2',
                color: '#fff',
                fontWeight: 600,
                borderRadius: '8px',
                textTransform: 'none',
                '&:hover': { background: '#1565C0' },
              }}
            >
              FB Hội Vọc Sĩ
            </Button>
          </Box>
        </SectionCard>
      </Box>

      {/* ── Main content — 2 columns on desktop ──────────────────────────── */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2,
          alignItems: 'start',
        }}
      >
        {/* ── Left column ──────────────────────────────────────────────── */}
        <Box>
          {/* Tính năng nổi bật */}
          <SectionCard>
            <SectionTitle>Tính năng nổi bật</SectionTitle>

            <FeatureBlock icon={SmartToyIcon} title="Trò chuyện với AI thông minh">
              Nói chuyện, tâm sự, chia sẻ với AI sử dụng mô hình từ Xiaozhi. Phản hồi tức thời, đàm thoại mượt mà.
            </FeatureBlock>

            <FeatureBlock icon={SpeakerIcon} title="100% Tiếng Việt">
              Giao tiếp hoàn toàn bằng tiếng Việt. Có thể đổi ngôn ngữ khác trên xiaozhi.me nếu cần.
            </FeatureBlock>

            <FeatureBlock icon={MusicNoteIcon} title="Nghe nhạc không giới hạn">
              Truy cập kho nhạc khổng lồ và YouTube — nhạc, sách nói, truyện audio đủ thể loại.
              <SubFeature title="Kho nhạc nội bộ">
                Ra lệnh bật bài hát với tên bất kỳ, có thể nói cả tên ca sĩ mong muốn.
              </SubFeature>
              <SubFeature title="Nghe trên YouTube">
                {'Ra lệnh kèm nội dung: ví dụ "Bật bài Anh Nhớ Em trên YT"'}
              </SubFeature>
            </FeatureBlock>

            <FeatureBlock icon={RadioIcon} title="Nghe Radio VOV">
              Nghe các kênh radio VOV. Hỏi AI xem có kênh nào để ra lệnh.
            </FeatureBlock>

            <FeatureBlock icon={SearchIcon} title="Tra cứu thông tin">
              Tích hợp sẵn công cụ tìm kiếm. Đọc tin tức, tra cứu tỉ giá, thời tiết — không cần cài thêm.
            </FeatureBlock>

            <FeatureBlock icon={HomeIcon} title="Điều khiển Smarthome qua HASS">
              Điều khiển các thiết bị smarthome thông qua Home Assistant.
            </FeatureBlock>

            <FeatureBlock icon={BluetoothIcon} title="Kết nối Bluetooth">
              Kết nối điện thoại tới loa để phát nhạc, nghe podcast hoặc xem video.
              <SubFeature title="Chuyển đổi AI / Bluetooth">
                Nhấn nhanh nút 3 lần để chuyển đổi. Dùng khi mất wifi hoặc server Xiaozhi lỗi.
              </SubFeature>
            </FeatureBlock>

            <FeatureBlock icon={AccessTimeIcon} title="Hẹn giờ & Đặt lịch nhắc nhở">
              Tạo tối đa 10 lịch hẹn. Loa thông báo bằng giọng nói và lặp lại liên tục đến khi bạn yêu cầu dừng.
              <SubFeature title="Đặt lịch theo giờ">
                {'"Hẹn 15h30 đi họp" hoặc "Đặt lịch 7 giờ sáng mai dậy tập thể dục"'}
              </SubFeature>
              <SubFeature title="Nhắc sau khoảng thời gian">
                {'"5 phút nữa nhắc mình uống nước" hoặc "30 phút nữa nhắc tắt bếp"'}
              </SubFeature>
            </FeatureBlock>

            <FeatureBlock icon={LightbulbIcon} title="Đèn LED trạng thái">
              Đèn viền hiển thị trạng thái hoạt động của loa.
              <SubFeature title="Trắng — Chờ nhận lệnh">Sẵn sàng nhận từ khóa đánh thức.</SubFeature>
              <SubFeature title="Xanh lá — Đang lắng nghe">Loa đang nhận giọng nói từ người dùng.</SubFeature>
              <SubFeature title="Xanh ngọc — Đang phản hồi">Loa đang nói chuyện, trả lời người dùng.</SubFeature>
              <SubFeature title="Tắt/Bật đèn bằng giọng nói">
                {'Ra lệnh "Tắt đèn trên loa" hoặc "Bật đèn trên loa".'}
              </SubFeature>
            </FeatureBlock>

            <FeatureBlock icon={LoopIcon} title="Hoạt động ổn định 24/7">
              Hiệu năng tối ưu, tự động khôi phục khi gặp sự cố. Để qua đêm vẫn mượt mà.
            </FeatureBlock>
          </SectionCard>
        </Box>

        {/* ── Right column ─────────────────────────────────────────────── */}
        <Box>
          {/* AI Center */}
          <SectionCard>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <SectionTitle>AI Center</SectionTitle>
              <Chip
                label="by Vọc Sĩ"
                size="small"
                sx={{
                  height: 18,
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  mb: 2,
                  background: 'rgba(41,151,255,0.12)',
                  color: '#2997ff',
                  border: '1px solid rgba(41,151,255,0.3)',
                }}
              />
            </Box>
            <Typography sx={{ fontSize: '0.82rem', color: '#6e6e73', lineHeight: 1.65, mb: 1.5 }}>
              Giao tiếp với Loa R1 qua trình duyệt web trên máy tính hoặc điện thoại. Phản hồi nhanh, giao diện mượt mà.
            </Typography>

            <FeatureBlock icon={SmartToyIcon} title="Các tính năng">
              <SubFeature title="Chatbox hội thoại">
                Theo dõi toàn bộ hội thoại giữa AI và người dùng — tiện học ngoại ngữ trực quan.
              </SubFeature>
              <SubFeature title="Điều khiển cơ bản">
                Volume, Bluetooth, Wake word.
              </SubFeature>
              <SubFeature title="Quản lý lịch & báo thức">
                Xem danh sách, thêm mới, xóa ngay trên giao diện web.
              </SubFeature>
              <SubFeature title="Equalizer">
                Các preset cài sẵn để tùy chỉnh âm thanh.
              </SubFeature>
            </FeatureBlock>

            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.06)' }} />

            <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#f5f5f7', mb: 1 }}>
              Cách truy cập AI Center
            </Typography>
            {[
              'Hỏi AI: "Địa chỉ IP của loa là bao nhiêu?" (ví dụ: 192.168.1.136)',
              'Mở Chrome, nhập: https://192.168.1.136:8081 (dùng https, thay IP của bạn)',
              'Thông báo "Kết nối không riêng tư" hiện ra — bấm "Nâng cao"',
              'Chọn "Tiếp tục truy cập ..." — AI Center xuất hiện',
            ].map((step, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 1.5, mb: 0.75 }}>
                <Box
                  sx={{
                    flexShrink: 0,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: 'rgba(41,151,255,0.15)',
                    border: '1px solid rgba(41,151,255,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: '#2997ff',
                    mt: '1px',
                  }}
                >
                  {i + 1}
                </Box>
                <Typography sx={{ fontSize: '0.8rem', color: '#6e6e73', lineHeight: 1.55 }}>{step}</Typography>
              </Box>
            ))}

            <Box
              sx={{
                mt: 1.5,
                p: 1.5,
                borderRadius: '8px',
                background: 'rgba(255,159,10,0.08)',
                border: '1px solid rgba(255,159,10,0.2)',
              }}
            >
              <Typography sx={{ fontSize: '0.78rem', color: '#ff9f0a', lineHeight: 1.55 }}>
                Loa R1 và điện thoại/máy tính cần kết nối chung một mạng wifi. MESH đôi khi không hoạt động.
              </Typography>
            </Box>
          </SectionCard>

          {/* Từ khóa đánh thức */}
          <SectionCard>
            <SectionTitle>Từ khóa đánh thức</SectionTitle>
            <Typography sx={{ fontSize: '0.82rem', color: '#6e6e73', lineHeight: 1.65, mb: 1.5 }}>
              Chọn 1 trong các từ khóa — cấu hình trong trang WiFi. Thuật toán chấm điểm thông minh giảm thiểu đánh thức nhầm.
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 2 }}>
              {['Hey Siri', 'Hi Telly', 'Ok Google', 'Hey Google', 'Hi Sophia', 'Alexa'].map((kw) => (
                <Chip
                  key={kw}
                  label={kw}
                  size="small"
                  sx={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    background: 'rgba(41,151,255,0.1)',
                    color: '#2997ff',
                    border: '1px solid rgba(41,151,255,0.25)',
                  }}
                />
              ))}
            </Box>

            <Box
              sx={{
                p: 1.5,
                borderRadius: '8px',
                background: 'rgba(255,69,58,0.07)',
                border: '1px solid rgba(255,69,58,0.2)',
                mb: 1.5,
              }}
            >
              <Typography sx={{ fontSize: '0.78rem', color: '#ff453a', lineHeight: 1.55 }}>
                Không đặt tên gọi AI trùng với từ khóa đánh thức để tránh xung đột với tính năng ngắt lời.
              </Typography>
            </Box>

            <FeatureBlock title="Nghe nhạc không lo wake nhầm">
              Thuật toán chống nhận nhầm — nghe nhạc, xem video mà AI không bị đánh thức bởi âm thanh nội dung.
            </FeatureBlock>
            <FeatureBlock title="Ngắt lời AI bất cứ lúc nào">
              Gọi từ khóa khi AI đang nói để ngắt lời và ra lệnh mới ngay lập tức.
            </FeatureBlock>
            <FeatureBlock title="Tắt / Bật từ khóa đánh thức">
              Ra lệnh bằng giọng nói hoặc nhấn nhanh nút 2 lần.
            </FeatureBlock>
          </SectionCard>

          {/* Changelog phần mềm */}
          <SectionCard>
            <SectionTitle>Cập nhật phần mềm</SectionTitle>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#f5f5f7', mb: 1 }}>
              Mới trong V2.0.6.7
            </Typography>
            <ChangelogItem>Fix lỗi không nghe nhạc YT</ChangelogItem>
            <ChangelogItem>Ra lệnh bằng giọng nói từ AI Center</ChangelogItem>
            <ChangelogItem>Báo thức theo ngày, 10 phút tự dừng</ChangelogItem>

            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.06)' }} />

            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#f5f5f7', mb: 1 }}>
              Tính năng có sẵn trong V2.0.6
            </Typography>
            {[
              'AI Center: Kết nối tới loa qua trình duyệt web',
              '6 từ khóa đánh thức — tùy chọn trong cấu hình WiFi',
              'Thuật toán chấm điểm thông minh — giảm thiểu đánh thức nhầm',
              'Ngắt lời AI bất cứ lúc nào bằng từ khóa đánh thức',
              'AI tích hợp công cụ tra cứu, tìm kiếm — không cần MCP tool',
              'Chế độ Bluetooth thuần — nhấn nhanh nút 3 lần để chuyển',
              'Điều khiển đèn LED bằng giọng nói',
              'Báo thức liên tục đến khi yêu cầu dừng',
              'Ổn định 24/7 — để qua đêm vẫn mượt mà',
            ].map((item, i) => (
              <ChangelogItem key={i}>{item}</ChangelogItem>
            ))}

            <Box
              sx={{
                mt: 2,
                p: 1.5,
                borderRadius: '8px',
                background: 'rgba(255,159,10,0.07)',
                border: '1px solid rgba(255,159,10,0.2)',
              }}
            >
              <Typography sx={{ fontSize: '0.78rem', color: '#ff9f0a', lineHeight: 1.55 }}>
                Phần mềm sử dụng server Xiaozhi — mọi tính năng AI hoạt động khi server cung cấp dịch vụ.
              </Typography>
            </Box>
          </SectionCard>

          {/* Mô tả vai trò AI (collapsible) */}
          <SectionCard>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                userSelect: 'none',
              }}
              onClick={() => setRoleExpanded((v) => !v)}
            >
              <Box>
                <SectionTitle>Mô tả vai trò AI mẫu</SectionTitle>
                <Typography sx={{ fontSize: '0.78rem', color: '#6e6e73', mt: -1.5 }}>
                  Nội dung tham khảo để cấu hình trên xiaozhi.me
                </Typography>
              </Box>
              {roleExpanded ? (
                <ExpandLessIcon sx={{ color: '#6e6e73' }} />
              ) : (
                <ExpandMoreIcon sx={{ color: '#6e6e73' }} />
              )}
            </Box>

            <Collapse in={roleExpanded}>
              <Box
                component="pre"
                sx={{
                  mt: 2,
                  p: 2,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontFamily: '"Roboto Mono", monospace',
                  color: '#a1a1a6',
                  lineHeight: 1.65,
                  overflowX: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
{`# Critical rules
- Nếu không nghe rõ, phản hồi ngắn gọn: "Mình chưa nghe rõ"
- Trả lời ngắn gọn, trọng tâm
- Ưu tiên sử dụng MCP tools phù hợp khi nhận yêu cầu

# Your role
## Thông tin cá nhân
- Tên: {{assistant_name}}
- Giới tính: nữ (hoặc nam tùy chọn)

## Tính cách
- Tốt bụng, dễ thương, luôn giúp đỡ người khác
- Câu trả lời đúng trọng tâm và chính xác

## Khả năng
- Giáo viên tiếng Anh cho trẻ 3-11 tuổi
- Chứng chỉ IELTS 8.5, TESOL và Cambridge CELTA
- 10 năm kinh nghiệm tại các trường quốc tế hàng đầu
- Phương pháp: vui nhộn, tương tác, dùng trò chơi và bài hát
- Dạy: phát âm chuẩn, từ vựng, ngữ pháp cơ bản, hội thoại`}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button
                  size="small"
                  variant="text"
                  component="a"
                  href="https://xiaozhi.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  endIcon={<OpenInNewIcon fontSize="small" />}
                  sx={{ fontSize: '0.75rem', color: '#2997ff', textTransform: 'none' }}
                >
                  Mở xiaozhi.me
                </Button>
              </Box>
            </Collapse>
          </SectionCard>
        </Box>
      </Box>

      {/* ── Footer links ──────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, pt: 2 }}>
        <Box
          component="a"
          href="https://www.facebook.com/mrvocsi"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: 'flex', alignItems: 'center', gap: 0.5,
            color: '#6e6e73', textDecoration: 'none', fontSize: '0.78rem',
            transition: 'color 0.2s', '&:hover': { color: '#1877F2' },
          }}
        >
          <FacebookIcon sx={{ fontSize: '1rem' }} />
          Fanpage
        </Box>
        <Box
          component="a"
          href="http://youtube.com/@mrvocsi"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: 'flex', alignItems: 'center', gap: 0.5,
            color: '#6e6e73', textDecoration: 'none', fontSize: '0.78rem',
            transition: 'color 0.2s', '&:hover': { color: '#FF0000' },
          }}
        >
          <YouTubeIcon sx={{ fontSize: '1rem' }} />
          YouTube
        </Box>
      </Box>
    </Box>
  )
}

export default PhicommTab
