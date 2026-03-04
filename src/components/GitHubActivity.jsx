import { useState, useEffect, useRef, Component } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import GitHubCalendar from 'react-github-calendar'
import { FaGithub } from 'react-icons/fa'
import { HiCode, HiStar, HiUsers } from 'react-icons/hi'

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: CURRENT_YEAR - 2023 }, (_, i) => 2024 + i)

class CalendarErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-10 font-mono text-sm" style={{ color: '#8b949e' }}>
          <div className="mb-2">Error: failed to load contribution data</div>
          <a href="https://github.com/CHISANW" target="_blank" rel="noopener noreferrer"
            className="hover:underline" style={{ color: '#818cf8' }}>
            $ gh browse CHISANW →
          </a>
        </div>
      )
    }
    return this.props.children
  }
}

const STATS_CONFIG = [
  { icon: HiCode,  key: 'repos',     label: 'public_repos', color: '#818cf8', bg: '#818cf815' },
  { icon: HiStar,  key: 'stars',     label: 'total_stars',  color: '#fbbf24', bg: '#fbbf2415' },
  { icon: HiUsers, key: 'followers', label: 'followers',    color: '#4ade80', bg: '#4ade8015' },
]

export default function GitHubActivity({ darkMode }) {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [stats, setStats] = useState({ repos: '...', stars: '...', followers: '...' })
  const [selectedYear, setSelectedYear] = useState(2025)

  // ── 잔디 블록 크기 동적 계산 ──────────────────────────
  const calendarWrapRef = useRef(null)
  const [blockSize, setBlockSize] = useState(12)
  const [calWidth,  setCalWidth]  = useState(0)
  const BLOCK_MARGIN = 3
  const TOTAL_WEEKS  = 53

  useEffect(() => {
    const el = calendarWrapRef.current
    if (!el) return
    const calc = () => {
      const w  = el.getBoundingClientRect().width
      setCalWidth(w)
      const bs = Math.floor((w - 32) / TOTAL_WEEKS) - BLOCK_MARGIN
      setBlockSize(Math.max(8, Math.min(bs, 16)))
    }
    calc()
    const ro = new ResizeObserver(calc)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // 벌레가 지나갈 행의 top 오프셋 (월 레이블 높이 + 행 인덱스 × 셀 높이)
  const rowTop = (rowIdx) => 18 + rowIdx * (blockSize + BLOCK_MARGIN)

  // 벌레 3마리 — 각자 다른 행·방향·딜레이
  const WORMS = [
    { row: 1, ltr: false, delay: 0  },
    { row: 3, ltr: true,  delay: 10 },
    { row: 5, ltr: false, delay: 20 },
  ]

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch('https://api.github.com/users/CHISANW'),
          fetch('https://api.github.com/users/CHISANW/repos?per_page=100'),
        ])
        if (!userRes.ok || !reposRes.ok) throw new Error()
        const user = await userRes.json()
        const repos = await reposRes.json()
        const totalStars = Array.isArray(repos) ? repos.reduce((a, r) => a + (r.stargazers_count || 0), 0) : 0
        setStats({ repos: user?.public_repos ?? 0, stars: totalStars, followers: user?.followers ?? 0 })
      } catch {
        setStats({ repos: '-', stars: '-', followers: '-' })
      }
    }
    fetchStats()
  }, [])

  return (
    <section id="github" className="hero-dot-bg py-24 overflow-hidden">
      <div ref={ref} className="section-container">

        {/* 섹션 헤더 */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45 }}
        >
          <div className="inline-flex items-center gap-1.5 font-mono text-sm mb-5" style={{ color: '#6b7280' }}>
            <span style={{ color: '#4ade80' }}>chisanw</span>
            <span>@dev:~$</span>
            <span style={{ color: '#e2e8f0' }}>gh contribution-graph CHISANW</span>
          </div>
          <h2
            className="text-4xl sm:text-5xl font-black tracking-tight mb-4 text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #38bdf8 100%)' }}
          >
            GitHub 활동
          </h2>
          <p className="font-mono text-sm" style={{ color: '#555' }}>
            # 꾸준한 커밋으로 성장하는 개발자입니다
          </p>
        </motion.div>

        {/* 터미널 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-xl overflow-hidden"
          style={{ border: '1px solid #30363d' }}
        >
          {/* 크롬 */}
          <div
            className="flex items-center justify-between px-5 py-3"
            style={{ background: '#161b22', borderBottom: '1px solid #21262d' }}
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
              </div>
              <span className="font-mono text-xs select-none" style={{ color: '#6b7280' }}>
                ~/github/CHISANW — contributions
              </span>
            </div>
            <a
              href="https://github.com/CHISANW"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-mono text-xs transition-colors"
              style={{ color: '#6b7280' }}
            >
              <FaGithub className="w-3.5 h-3.5" />
              @CHISANW
            </a>
          </div>

          {/* 바디 */}
          <div className="p-6 sm:p-8" style={{ background: '#0d1117' }}>

            {/* $ env 스타일 스탯 */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {STATS_CONFIG.map(({ icon: Icon, key, label, color, bg }) => (
                <div
                  key={key}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl font-mono"
                  style={{ background: bg, border: `1px solid ${color}25` }}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
                    <Icon className="w-3.5 h-3.5" style={{ color }} />
                  </div>
                  <div className="text-xl font-bold" style={{ color }}>{stats[key]}</div>
                  <div className="text-[10px]" style={{ color: '#6b7280' }}>{label}</div>
                </div>
              ))}
            </div>

            {/* 연도 선택 */}
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono text-xs" style={{ color: '#6b7280' }}>
                $ git log --year
              </span>
              <div className="flex items-center gap-1.5 p-1 rounded-lg" style={{ background: '#161b22' }}>
                {YEARS.map(year => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className="relative px-3.5 py-1.5 rounded-md font-mono text-xs font-semibold transition-all"
                    style={selectedYear === year ? { color: '#e2e8f0' } : { color: '#6b7280' }}
                  >
                    {selectedYear === year && (
                      <motion.div
                        layoutId="year-pill"
                        className="absolute inset-0 rounded-md"
                        style={{ background: '#6366f1' }}
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                    <span className="relative z-10">{year}</span>
                    {year === CURRENT_YEAR && (
                      <span className="relative z-10 ml-1 text-[9px]" style={{ color: '#818cf8' }}>NOW</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 잔디 캘린더 + 🐛 애니메이션 */}
            <div ref={calendarWrapRef} className="cal-fill w-full relative">

              {/* 캘린더 */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedYear}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                >
                  <CalendarErrorBoundary key={selectedYear}>
                    <GitHubCalendar
                      username="CHISANW"
                      year={selectedYear}
                      colorScheme="dark"
                      fontSize={11}
                      blockSize={blockSize}
                      blockMargin={BLOCK_MARGIN}
                      theme={{ dark: ['#1e2433', '#3730a3', '#4f46e5', '#818cf8', '#c7d2fe'] }}
                      labels={{ totalCount: '{{count}}개의 기여 ({{year}})' }}
                    />
                  </CalendarErrorBoundary>
                </motion.div>
              </AnimatePresence>

              {/* 🐛 잔디 먹는 벌레들 */}
              {calWidth > 0 && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {WORMS.map(({ row, ltr, delay }) => (
                    <motion.span
                      key={row}
                      className="absolute select-none"
                      style={{
                        top: rowTop(row),
                        fontSize: '13px',
                        lineHeight: 1,
                        display: 'inline-block',
                        scaleX: ltr ? 1 : -1,
                      }}
                      animate={{
                        x: ltr ? [-20, calWidth + 20] : [calWidth + 20, -20],
                        y: [0, -2, 0, 2, 0],
                      }}
                      transition={{
                        x: {
                          duration: 10,
                          repeat: Infinity,
                          repeatDelay: 20,
                          delay,
                          ease: 'linear',
                        },
                        y: {
                          duration: 0.4,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        },
                      }}
                    >
                      🐛
                    </motion.span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          <a
            href="https://github.com/CHISANW"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-sm transition-colors hover:-translate-y-0.5 transition-transform duration-200"
            style={{ background: '#6366f1', color: '#fff' }}
          >
            <FaGithub className="w-4 h-4" />
            $ gh browse CHISANW
          </a>
        </motion.div>

      </div>
    </section>
  )
}
