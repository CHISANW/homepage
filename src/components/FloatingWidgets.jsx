import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { visitorApi, likeApi } from '../services/portfolioApi'

// ── 하트 SVG ────────────────────────────────────────────
function HeartIcon({ filled, className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" stroke="currentColor" fill={filled ? 'currentColor' : 'none'} strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  )
}

// ── 눈 SVG ──────────────────────────────────────────────
function EyeIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  )
}

// ── 방문자 카운터 위젯 ───────────────────────────────────
function VisitorWidget({ count }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl"
      style={{ background: '#0d1117', border: '1px solid #30363d' }}
      title="오늘 방문자 수"
    >
      <EyeIcon className="w-4 h-4" style={{ color: '#38bdf8' }} />
      <span
        className="font-mono text-sm font-bold tabular-nums leading-none"
        style={{ color: '#38bdf8' }}
      >
        {count === null ? '...' : count}
      </span>
      <span
        className="font-mono text-[9px] leading-none"
        style={{ color: '#555' }}
      >
        today
      </span>
    </motion.div>
  )
}

// ── 좋아요 버튼 위젯 ────────────────────────────────────
function LikeWidget({ count, liked, onToggle, loading }) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.65 }}
      onClick={onToggle}
      disabled={loading}
      whileTap={{ scale: 0.85 }}
      className="flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl transition-all disabled:opacity-60 cursor-pointer group"
      style={{
        background: liked ? '#f8717120' : '#0d1117',
        border: liked ? '1px solid #f8717150' : '1px solid #30363d',
      }}
      title={liked ? '좋아요 취소' : '좋아요'}
    >
      <motion.div
        animate={liked ? { scale: [1, 1.4, 1], rotate: [0, -15, 15, 0] } : { scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <HeartIcon
          filled={liked}
          className="w-4 h-4"
          style={{ color: liked ? '#f87171' : '#8b949e' }}
        />
      </motion.div>
      <span
        className="font-mono text-sm font-bold tabular-nums leading-none"
        style={{ color: liked ? '#f87171' : '#8b949e' }}
      >
        {count === null ? '...' : count}
      </span>
      <span
        className="font-mono text-[9px] leading-none"
        style={{ color: '#555' }}
      >
        likes
      </span>

      {/* 하트 파티클 */}
      <AnimatePresence>
        {liked && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute text-xs pointer-events-none select-none"
                initial={{ opacity: 1, y: 0, x: 0, scale: 0.8 }}
                animate={{
                  opacity: 0,
                  y: -28 - i * 6,
                  x: (i % 2 === 0 ? 1 : -1) * (8 + i * 4),
                  scale: 1.2,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, delay: i * 0.05 }}
              >
                ❤
              </motion.span>
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

// ── 메인 FloatingWidgets ─────────────────────────────────
export default function FloatingWidgets() {
  const [visitors, setVisitors] = useState(null)
  const [likes,    setLikes]    = useState(null)
  const [liked,    setLiked]    = useState(false)
  const [likeLoading, setLikeLoading] = useState(false)

  // 초기 데이터 로드
  useEffect(() => {
    visitorApi.recordVisit().then(d => setVisitors(d.today)).catch(() => setVisitors('-'))
    likeApi.getStatus().then(d => { setLikes(d.count); setLiked(d.liked) }).catch(() => setLikes('-'))
  }, [])

  const handleLike = async () => {
    if (likeLoading) return
    setLikeLoading(true)
    try {
      const result = await likeApi.toggle(liked)
      setLikes(result.count)
      setLiked(result.liked)
    } catch {
      // no-op
    } finally {
      setLikeLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 items-center">
      <VisitorWidget count={visitors} />
      <div className="relative">
        <LikeWidget count={likes} liked={liked} onToggle={handleLike} loading={likeLoading} />
      </div>
    </div>
  )
}
