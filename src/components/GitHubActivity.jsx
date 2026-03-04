import { useState, useEffect, useRef, useMemo, Component } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaGithub } from 'react-icons/fa'
import { HiCode, HiStar, HiUsers } from 'react-icons/hi'

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: CURRENT_YEAR - 2023 }, (_, i) => 2024 + i)

// ── Stats 설정 ────────────────────────────────────────────
const STATS_CONFIG = [
  { icon: HiCode,  key: 'repos',     label: 'public_repos', color: '#818cf8', bg: '#818cf815' },
  { icon: HiStar,  key: 'stars',     label: 'total_stars',  color: '#fbbf24', bg: '#fbbf2415' },
  { icon: HiUsers, key: 'followers', label: 'followers',    color: '#4ade80', bg: '#4ade8015' },
]

// ══════════════════════════════════════════════════════════
// ScanCursor — 개발자 테마 스캔 커서
//   forward(삭제): 빨간 레이저 빔  '>>'
//   backward(복원): 초록 빔       '<<'
// ══════════════════════════════════════════════════════════
const THEME      = ['#1e2433', '#3730a3', '#4f46e5', '#818cf8', '#c7d2fe']
const TRAIL_COLOR = '#0c1020'
const TRAIL      = 12
const STEP_MS    = 55

const MONTHS    = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAY_NAMES = ['', 'Mon', '', 'Wed', '', 'Fri', '']

function buildCols(contributions) {
  if (!contributions?.length) return []
  const startDow = new Date(contributions[0].date + 'T00:00:00').getDay()
  const cells = [...Array(startDow).fill(null), ...contributions]
  while (cells.length % 7 !== 0) cells.push(null)
  const cols = []
  for (let c = 0; c < cells.length / 7; c++) cols.push(cells.slice(c * 7, c * 7 + 7))
  return cols
}

function getMonthLabels(cols) {
  const labels = new Array(cols.length).fill('')
  let last = -1
  cols.forEach((col, i) => {
    const d = col.find(Boolean)
    if (!d) return
    const m = new Date(d.date + 'T00:00:00').getMonth()
    if (m !== last) { labels[i] = MONTHS[m]; last = m }
  })
  return labels
}

function cellToPath(col, row, numCols) {
  return row % 2 === 0
    ? row * numCols + col
    : row * numCols + (numCols - 1 - col)
}

// 개발자 스캔 커서 — 빔 모양의 글로우 박스
function ScanCursor({ blockSize, cellSize, movingRight, phase }) {
  const isForward = phase === 'forward'
  const color  = isForward ? '#ef4444' : '#4ade80'
  const glow   = isForward
    ? `0 0 4px #ef4444, 0 0 12px #f97316, 0 0 24px #ef444440`
    : `0 0 4px #4ade80, 0 0 12px #22c55e, 0 0 24px #4ade8040`
  // 진행 방향에 맞는 화살표
  const label  = isForward
    ? (movingRight ? '>>' : '<<')
    : (movingRight ? '>>' : '<<')

  return (
    <div style={{ width: cellSize, height: cellSize, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* 세로 빔 라인 */}
      <div style={{
        position: 'absolute',
        width: 2,
        height: cellSize * 7,
        background: isForward
          ? 'linear-gradient(to bottom, transparent, #ef444460, #ef4444, #ef444460, transparent)'
          : 'linear-gradient(to bottom, transparent, #4ade8060, #4ade80, #4ade8060, transparent)',
        top: -(cellSize * 3),
        left: cellSize / 2 - 1,
        pointerEvents: 'none',
      }} />
      {/* 커서 본체 */}
      <div style={{
        width: blockSize + 6,
        height: blockSize + 6,
        borderRadius: 3,
        background: `linear-gradient(135deg, ${color}cc, ${color}88)`,
        border: `1px solid ${color}`,
        boxShadow: glow,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'monospace',
        fontWeight: 900,
        fontSize: Math.max(7, blockSize - 3),
        color: '#fff',
        lineHeight: 1,
        letterSpacing: -1,
        userSelect: 'none',
        flexShrink: 0,
      }}>
        {label}
      </div>
    </div>
  )
}

function WormCalendar({ username, year, blockSize, blockMargin }) {
  const [cols,    setCols]    = useState([])
  const [total,   setTotal]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [step,    setStep]    = useState(0)
  // 'forward' → 커서가 좌→우 이동하며 잔디를 지움
  // 'backward' → 커서가 우→좌로 되돌아가며 잔디를 복원
  const [phase,   setPhase]   = useState('forward')

  const numCols    = cols.length
  const totalCells = numCols * 7
  const cellSize   = blockSize + blockMargin

  useEffect(() => {
    setLoading(true); setCols([]); setTotal(null); setStep(0); setPhase('forward')
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=${year}`)
      .then(r => r.json())
      .then(({ contributions, total: t }) => {
        setCols(buildCols(contributions))
        setTotal(t?.[year] ?? t?.lastYear ?? 0)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [username, year])

  // 타이머: step을 증가시키되, 각 페이즈의 상한선에서 멈춤
  // → 상한선 도달 시 setStep이 동일 값을 반환 → re-render 없음 → 전환 타임아웃이 정상 작동
  useEffect(() => {
    if (!totalCells) return
    const cap = phase === 'forward'
      ? totalCells + TRAIL + 2   // 모든 셀 소멸 완료 후 여유
      : totalCells + 2           // 모든 셀 복원 완료 후 여유
    const id = setInterval(() => setStep(s => s < cap ? s + 1 : s), STEP_MS)
    return () => clearInterval(id)
  }, [totalCells, phase])

  // forward 완료 → backward 전환
  useEffect(() => {
    if (phase !== 'forward' || !totalCells || step < totalCells + TRAIL) return
    const t = setTimeout(() => { setStep(0); setPhase('backward') }, 350)
    return () => clearTimeout(t)
  }, [step, phase, totalCells])

  // backward 완료 → forward 재시작
  useEffect(() => {
    if (phase !== 'backward' || !totalCells || step < totalCells) return
    const t = setTimeout(() => { setStep(0); setPhase('forward') }, 350)
    return () => clearTimeout(t)
  }, [step, phase, totalCells])

  const monthLabels = useMemo(() => getMonthLabels(cols), [cols])

  // ── 커서 위치 계산 ─────────────────────────────────────
  const headPIdx = phase === 'forward'
    ? Math.min(step, totalCells - 1)
    : Math.max(totalCells - 1 - step, 0)
  const showCursor = step < totalCells
  const headRow    = Math.floor(headPIdx / numCols)
  const headOff    = headPIdx % numCols
  const headCol    = headRow % 2 === 0 ? headOff : numCols - 1 - headOff
  // 실제 이동 방향: forward+짝수행=우, backward+짝수행=좌 (반전)
  const movingRight = (phase === 'forward') === (headRow % 2 === 0)

  // ── 로딩 스켈레톤 ─────────────────────────────────────
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="flex mb-1" style={{ paddingLeft: 32 }}>
          {Array(12).fill(0).map((_, i) => (
            <div key={i} style={{ width: 40, height: 10, background: '#1e2433', borderRadius: 2, marginRight: 8 }} />
          ))}
        </div>
        <div className="flex gap-[3px]" style={{ paddingLeft: 36 }}>
          {Array(53).fill(0).map((_, c) => (
            <div key={c} style={{ display: 'flex', flexDirection: 'column', gap: 3, flexShrink: 0 }}>
              {Array(7).fill(0).map((_, r) => (
                <div key={r} style={{ width: blockSize, height: blockSize, background: '#1e2433', borderRadius: 2 }} />
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!cols.length) return (
    <div className="text-center py-8 font-mono text-sm" style={{ color: '#8b949e' }}>
      No contribution data found.{' '}
      <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer"
        className="hover:underline" style={{ color: '#818cf8' }}>
        View on GitHub →
      </a>
    </div>
  )

  return (
    <div>
      {/* 월 레이블 */}
      <div className="flex mb-1" style={{ paddingLeft: 32 }}>
        {cols.map((_, i) => (
          <div
            key={i}
            style={{
              width: cellSize,
              flexShrink: 0,
              fontSize: 10,
              color: '#6b7280',
              fontFamily: 'monospace',
              overflow: 'visible',
              whiteSpace: 'nowrap',
            }}
          >
            {monthLabels[i]}
          </div>
        ))}
      </div>

      <div className="flex">
        {/* 요일 레이블 */}
        <div
          style={{
            width: 28,
            marginRight: blockMargin + 4,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: blockMargin,
          }}
        >
          {DAY_NAMES.map((label, i) => (
            <div
              key={i}
              style={{
                height: blockSize,
                fontSize: 9,
                color: '#6b7280',
                fontFamily: 'monospace',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* 셀 그리드 + 커서 오버레이 */}
        <div className="relative flex" style={{ gap: blockMargin }}>
          {cols.map((col, cIdx) => (
            <div
              key={cIdx}
              style={{ display: 'flex', flexDirection: 'column', gap: blockMargin, flexShrink: 0 }}
            >
              {col.map((day, rIdx) => {
                const pIdx = cellToPath(cIdx, rIdx, numCols)
                const base = day ? THEME[day.level] : THEME[0]

                let cellStyle

                if (phase === 'forward') {
                  // 커서가 완전히 지나간 셀 → scale(0)으로 소멸
                  const eatenPermanently = step >= TRAIL && pIdx <= step - TRAIL
                  // 커서 꼬리 안 셀 → 어두운 색
                  const inTrail = pIdx > step - TRAIL && pIdx <= step

                  if (eatenPermanently) {
                    cellStyle = {
                      transform: 'scale(0)',
                      opacity: 0,
                      backgroundColor: base,
                      transition: 'transform 0.13s ease-in, opacity 0.13s ease-in',
                    }
                  } else if (inTrail) {
                    cellStyle = {
                      transform: 'scale(1)',
                      opacity: 1,
                      backgroundColor: TRAIL_COLOR,
                      transition: 'background-color 0.06s ease-out',
                    }
                  } else {
                    cellStyle = {
                      transform: 'scale(1)',
                      opacity: 1,
                      backgroundColor: base,
                      transition: 'background-color 0.5s ease-in',
                    }
                  }
                } else {
                  // backward: 커서가 지나가면 셀이 스프링 애니메이션으로 복원
                  // pIdx >= totalCells - step 이면 이미 복원됨
                  const restored = pIdx >= totalCells - step

                  // transition을 항상 정의해두어야 브라우저가 변화를 감지해 애니메이션을 실행함
                  // 'none' 대신 아주 짧은 시간(0.001s)을 사용해 즉시 적용처럼 보이게 함
                  cellStyle = restored
                    ? {
                        transform: 'scale(1)',
                        opacity: 1,
                        backgroundColor: base,
                        transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease-out, background-color 0.25s ease-out',
                      }
                    : {
                        transform: 'scale(0)',
                        opacity: 0,
                        backgroundColor: base,
                        transition: 'transform 0.001s, opacity 0.001s',
                      }
                }

                return (
                  <div
                    key={rIdx}
                    style={{ width: blockSize, height: blockSize, borderRadius: 2, ...cellStyle }}
                  />
                )
              })}
            </div>
          ))}

          {/* 스캔 커서 — Motion으로 부드럽게 이동 */}
          {showCursor && (
            <motion.div
              className="absolute pointer-events-none z-20"
              style={{ width: cellSize, height: cellSize }}
              animate={{
                left: headCol * cellSize,
                top:  headRow * cellSize,
              }}
              transition={{
                left: { duration: STEP_MS / 1000 * 0.85, ease: 'linear' },
                top:  { duration: STEP_MS / 1000 * 0.85, ease: 'linear' },
              }}
            >
              <ScanCursor
                blockSize={blockSize}
                cellSize={cellSize}
                movingRight={movingRight}
                phase={phase}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* 페이즈 상태 + 총 기여 수 */}
      <div className="mt-4 flex items-center gap-3">
        {total !== null && (
          <span className="text-xs font-mono" style={{ color: '#8b949e' }}>
            {total}개의 기여 ({year})
          </span>
        )}
        <span className="text-[10px] font-mono px-2 py-0.5 rounded" style={{
          background: phase === 'forward' ? '#ef444415' : '#4ade8015',
          color:      phase === 'forward' ? '#ef4444'   : '#4ade80',
          border:     `1px solid ${phase === 'forward' ? '#ef444430' : '#4ade8030'}`,
        }}>
          {phase === 'forward' ? '>> scanning' : '<< restoring'}
        </span>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════
// 메인 섹션
// ══════════════════════════════════════════════════════════
export default function GitHubActivity({ darkMode }) {
  const [ref, inView]       = useInView({ threshold: 0.1, triggerOnce: true })
  const [stats, setStats]   = useState({ repos: '...', stars: '...', followers: '...' })
  const [selectedYear, setSelectedYear] = useState(2025)

  // 잔디 컨테이너 폭 → blockSize 동적 계산
  const calendarWrapRef = useRef(null)
  const [blockSize, setBlockSize] = useState(12)
  const BLOCK_MARGIN = 3
  const LABEL_W      = 36   // 요일 레이블 + gap

  useEffect(() => {
    const el = calendarWrapRef.current
    if (!el) return
    const calc = () => {
      const w  = el.getBoundingClientRect().width
      const bs = Math.floor((w - LABEL_W) / 53) - BLOCK_MARGIN
      setBlockSize(Math.max(8, Math.min(bs, 16)))
    }
    calc()
    const ro = new ResizeObserver(calc)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // GitHub 통계
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch('https://api.github.com/users/CHISANW'),
          fetch('https://api.github.com/users/CHISANW/repos?per_page=100'),
        ])
        if (!userRes.ok || !reposRes.ok) throw new Error()
        const user  = await userRes.json()
        const repos = await reposRes.json()
        const totalStars = Array.isArray(repos)
          ? repos.reduce((a, r) => a + (r.stargazers_count || 0), 0)
          : 0
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

            {/* 스탯 3개 */}
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
              <span className="font-mono text-xs" style={{ color: '#6b7280' }}>$ git log --year</span>
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

            {/* 잔디 캘린더 (벌레 포함) */}
            <div ref={calendarWrapRef} className="w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedYear}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                >
                  <WormCalendar
                    username="CHISANW"
                    year={selectedYear}
                    blockSize={blockSize}
                    blockMargin={BLOCK_MARGIN}
                  />
                </motion.div>
              </AnimatePresence>
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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-sm hover:-translate-y-0.5 transition-transform duration-200"
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
