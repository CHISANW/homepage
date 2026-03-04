import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiArrowDown } from 'react-icons/hi'
import { FaGithub, FaEnvelope } from 'react-icons/fa'

const ROLES = [
  '백엔드 개발자',
  'Java Developer',
  'Spring Boot Engineer',
  'Cloud Native Developer',
]

function useTypewriter(words, startDelay = 0) {
  const [state, setState] = useState({
    text: '',
    wordIdx: 0,
    deleting: false,
    started: startDelay === 0,
  })

  useEffect(() => {
    if (startDelay > 0) {
      const id = setTimeout(
        () => setState((s) => ({ ...s, started: true })),
        startDelay * 1000
      )
      return () => clearTimeout(id)
    }
  }, [startDelay])

  useEffect(() => {
    if (!state.started) return
    const { text, wordIdx, deleting } = state
    const word = words[wordIdx]
    if (!deleting && text === word) {
      const id = setTimeout(() => setState((s) => ({ ...s, deleting: true })), 2200)
      return () => clearTimeout(id)
    }
    const speed = deleting ? 40 : 85
    const id = setTimeout(() => {
      setState((s) => {
        if (!s.started) return s
        if (s.deleting) {
          const next = s.text.slice(0, -1)
          return {
            ...s,
            text: next,
            wordIdx: next === '' ? (s.wordIdx + 1) % words.length : s.wordIdx,
            deleting: next !== '',
          }
        }
        return { ...s, text: word.slice(0, s.text.length + 1) }
      })
    }, speed)
    return () => clearTimeout(id)
  }, [state, words])

  return state.text
}

function Prompt({ command, delay }) {
  return (
    <motion.div
      className="flex items-start mb-1.5 flex-wrap"
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay }}
    >
      <span className="shrink-0 select-none mr-1.5">
        <span style={{ color: '#4ade80' }}>chisanw</span>
        <span style={{ color: '#555' }}>@</span>
        <span style={{ color: '#818cf8' }}>dev</span>
        <span style={{ color: '#555' }}>:~$&nbsp;</span>
      </span>
      <span style={{ color: '#e2e8f0' }}>{command}</span>
    </motion.div>
  )
}

const DOCKER_ROWS = [
  { name: 'spring-api',   status: 'Up 3 hours' },
  { name: 'mysql-8.0',    status: 'Up 3 hours' },
  { name: 'redis-alpine', status: 'Up 3 hours' },
  { name: 'nginx-proxy',  status: 'Up 3 hours' },
]

const KUBE_ROWS = [
  { name: 'api-7f9b4-x8v2', r: '0' },
  { name: 'api-7f9b4-m3kp', r: '0' },
]

const JSON_LINES = [
  { d: 0.9,  key: null,       val: '{',                       kc: '#e2e8f0', vc: '#e2e8f0' },
  { d: 1.0,  key: '"name"',   val: '"김민우"',                kc: '#79c0ff', vc: '#a5d6ff' },
  { d: 1.1,  key: '"role"',   val: '"Backend Developer"',     kc: '#79c0ff', vc: '#a5d6ff' },
  { d: 1.2,  key: '"career"', val: '"1년차"',                 kc: '#79c0ff', vc: '#a5d6ff' },
  { d: 1.3,  key: '"stack"',  val: '["Java","Spring","K8s"]', kc: '#79c0ff', vc: '#ffa657' },
  { d: 1.4,  key: '"github"', val: '"CHISANW"',               kc: '#79c0ff', vc: '#a5d6ff' },
  { d: 1.5,  key: '"status"', val: '"available ✓"',           kc: '#79c0ff', vc: '#4ade80' },
  { d: 1.6,  key: null,       val: '}',                       kc: '#e2e8f0', vc: '#e2e8f0' },
]

export default function Hero() {
  const role = useTypewriter(ROLES, 0.4)

  const scrollToAbout = () =>
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section
      id="hero"
      className="hero-dot-bg min-h-screen flex flex-col items-center justify-center relative overflow-hidden pt-16"
    >
      {/* 다크 비네트 */}
      <div className="hero-vignette absolute inset-0 pointer-events-none" />

      {/* 인디고 상단 글로우 */}
      <div
        className="absolute -top-10 left-1/4 w-[800px] h-[400px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 40% 0%, rgba(99,102,241,0.18) 0%, transparent 65%)',
        }}
      />

      <div className="section-container w-full relative z-10 py-12">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ══════════════════════════
              왼쪽 — 이름 / 타이틀 / CTA
          ══════════════════════════ */}
          <div className="flex flex-col justify-center order-2 lg:order-1 text-center lg:text-left">

            {/* Available 배지 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6
                         self-center lg:self-start font-mono text-xs border"
              style={{ background: '#0d1117', borderColor: '#30363d', color: '#6b7280' }}
            >
              <motion.span
                className="w-2 h-2 rounded-full"
                style={{ background: '#4ade80' }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
              <span style={{ color: '#4ade80' }}>OPEN</span>
              &nbsp;to new opportunities
            </motion.div>

            {/* 이름 */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.55 }}
              className="font-black tracking-tight leading-none mb-5"
              style={{ fontSize: 'clamp(3.5rem, 8vw, 6.5rem)' }}
            >
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    'linear-gradient(135deg, #6366f1 0%, #a855f7 45%, #38bdf8 100%)',
                }}
              >
                김민우
              </span>
            </motion.h1>

            {/* 타이핑 역할 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="flex items-center gap-2 mb-6 self-center lg:self-start"
            >
              <span
                className="font-mono text-xl sm:text-2xl font-bold select-none"
                style={{ color: '#4ade80' }}
              >
                ›_
              </span>
              <span
                className="font-mono text-xl sm:text-2xl font-semibold"
                style={{ color: '#818cf8' }}
              >
                {role}
                <motion.span
                  className="inline-block w-[2px] h-[1em] ml-0.5 align-text-bottom rounded-[1px]"
                  style={{ background: '#818cf8' }}
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.7, repeat: Infinity }}
                />
              </span>
            </motion.div>

            {/* 설명 */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-base sm:text-lg leading-relaxed mb-8 max-w-md mx-auto lg:mx-0"
              style={{ color: '#9ca3af' }}
            >
              Java · Spring Boot 기반으로 확장 가능한 백엔드 시스템을 설계합니다.
              <br />
              Kubernetes · Docker 클라우드 네이티브 환경 개발 경험 보유.
            </motion.p>

            {/* CTA 버튼 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="flex flex-col sm:flex-row items-center lg:items-start gap-3 mb-10"
            >
              <a
                href="https://github.com/CHISANW"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full sm:w-auto justify-center"
              >
                <FaGithub className="w-5 h-5" />
                GitHub 방문하기
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault()
                  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="btn-outline w-full sm:w-auto justify-center"
              >
                <FaEnvelope className="w-5 h-5" />
                Contact
              </a>
            </motion.div>

            {/* 퀵 스탯 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap justify-center lg:justify-start gap-6 pt-6 border-t font-mono"
              style={{ borderColor: '#1e2433' }}
            >
              {[
                { k: 'career',     v: '1년차' },
                { k: 'main_stack', v: 'Java / Spring' },
                { k: 'blog_posts', v: '105+' },
                { k: 'status',     v: 'open_to_work' },
              ].map(({ k, v }) => (
                <div key={k} className="text-center">
                  <div
                    className="text-sm font-bold dark:text-[#4ade80] text-emerald-600"
                  >
                    {v}
                  </div>
                  <div className="text-xs mt-0.5 text-gray-500">{k}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ══════════════════════════
              오른쪽 — 터미널
          ══════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="order-1 lg:order-2"
          >
            {/* 창 크롬 */}
            <div
              className="flex items-center px-4 py-2.5 rounded-t-xl gap-2"
              style={{
                background: '#161b22',
                border: '1px solid #30363d',
                borderBottom: '1px solid #21262d',
              }}
            >
              <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
              <span className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
              <span className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
              <span
                className="flex-1 text-center font-mono text-xs select-none"
                style={{ color: '#6b7280' }}
              >
                terminal — zsh — 80×24
              </span>
            </div>

            {/* 터미널 바디 */}
            <div
              className="rounded-b-xl p-5 sm:p-6 font-mono text-xs sm:text-sm leading-relaxed"
              style={{
                background: '#0d1117',
                border: '1px solid #30363d',
                borderTop: 'none',
              }}
            >
              {/* ── curl API ── */}
              <Prompt
                command="curl -s GET /api/developer/profile | jq"
                delay={0.6}
              />

              {/* JSON 출력 */}
              <div className="mb-4">
                {JSON_LINES.map(({ d, key, val, kc, vc }, i) => (
                  <motion.div
                    key={i}
                    className="leading-[1.65]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: d }}
                  >
                    {key ? (
                      <>
                        <span style={{ color: '#6b7280' }}>{'  '}</span>
                        <span style={{ color: kc }}>{key}</span>
                        <span style={{ color: '#6b7280' }}>: </span>
                        <span style={{ color: vc }}>{val}</span>
                        {i < JSON_LINES.length - 2 && (
                          <span style={{ color: '#6b7280' }}>,</span>
                        )}
                      </>
                    ) : (
                      <span style={{ color: '#e2e8f0' }}>{val}</span>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* ── docker ps ── */}
              <Prompt
                command="docker ps --format 'table {{.Names}}\t{{.Status}}'"
                delay={1.9}
              />

              <motion.div
                className="mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.1 }}
              >
                {/* 헤더 */}
                <div
                  className="grid gap-4 px-0 mb-1 text-xs"
                  style={{ gridTemplateColumns: '1fr 1fr', color: '#555' }}
                >
                  <span>NAMES</span>
                  <span>STATUS</span>
                </div>
                {/* 행 */}
                {DOCKER_ROWS.map(({ name, status }, i) => (
                  <motion.div
                    key={name}
                    className="grid gap-4"
                    style={{ gridTemplateColumns: '1fr 1fr' }}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.25 + i * 0.12, duration: 0.18 }}
                  >
                    <span style={{ color: '#38bdf8' }}>{name}</span>
                    <span style={{ color: '#4ade80' }}>{status}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* ── kubectl get pods ── */}
              <Prompt
                command="kubectl get pods -n production"
                delay={3.0}
              />

              <motion.div
                className="mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.2 }}
              >
                <div
                  className="grid gap-3 mb-1 text-xs"
                  style={{ gridTemplateColumns: '2fr 1fr 1fr', color: '#555' }}
                >
                  <span>NAME</span>
                  <span>STATUS</span>
                  <span>RESTARTS</span>
                </div>
                {KUBE_ROWS.map(({ name, r }, i) => (
                  <motion.div
                    key={name}
                    className="grid gap-3"
                    style={{ gridTemplateColumns: '2fr 1fr 1fr' }}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 3.35 + i * 0.14, duration: 0.18 }}
                  >
                    <span style={{ color: '#e2e8f0' }} className="truncate">{name}</span>
                    <span style={{ color: '#4ade80' }}>Running</span>
                    <span style={{ color: '#6b7280' }}>{r}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* ── 최종 커서 ── */}
              <motion.div
                className="flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.8 }}
              >
                <span className="select-none" style={{ color: '#4ade80' }}>chisanw</span>
                <span style={{ color: '#555' }}>@</span>
                <span style={{ color: '#818cf8' }}>dev</span>
                <span style={{ color: '#555' }}>:~$&nbsp;</span>
                <motion.span
                  className="inline-block w-2 h-[1.1em] rounded-[1px] align-text-bottom"
                  style={{ background: '#6366f1' }}
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.85, repeat: Infinity }}
                />
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* 스크롤 인디케이터 */}
      <motion.button
        onClick={scrollToAbout}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1
                   text-gray-400 hover:text-indigo-500 dark:text-gray-600 dark:hover:text-indigo-400
                   transition-colors cursor-pointer font-mono"
        aria-label="아래로 스크롤"
      >
        <span className="text-[10px] tracking-widest uppercase opacity-60">scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <HiArrowDown className="w-5 h-5" />
        </motion.div>
      </motion.button>
    </section>
  )
}
