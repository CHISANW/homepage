import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaGithub, FaEnvelope, FaBlog } from 'react-icons/fa'
import { HiCheckCircle, HiExclamationCircle } from 'react-icons/hi'

const CONTACTS = [
  {
    icon: FaGithub,
    label: 'github',
    value: 'github.com/CHISANW',
    href: 'https://github.com/CHISANW',
    color: '#e2e8f0',
  },
  {
    icon: FaEnvelope,
    label: 'email',
    value: 'keuye06380618@gmail.com',
    href: 'mailto:keuye06380618@gmail.com',
    color: '#f87171',
  },
  {
    icon: FaBlog,
    label: 'blog',
    value: 'back-stead.tistory.com',
    href: 'https://back-stead.tistory.com',
    color: '#fbbf24',
  },
]

function TerminalInput({ label, name, value, onChange, type = 'text', placeholder, as = 'input', rows }) {
  const common = {
    name,
    value,
    onChange,
    required: true,
    placeholder,
    className: 'w-full px-4 py-2.5 font-mono text-sm rounded-lg transition-all outline-none',
    style: {
      background: '#0a0f1e',
      border: '1px solid #30363d',
      color: '#e2e8f0',
    },
    onFocus: e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px #6366f120' },
    onBlur:  e => { e.target.style.borderColor = '#30363d'; e.target.style.boxShadow = 'none' },
  }

  return (
    <div>
      <div className="font-mono text-xs mb-1.5 flex items-center gap-1.5" style={{ color: '#4ade80' }}>
        <span style={{ color: '#6b7280' }}>&gt;</span>
        <span>{label}</span>
        <span style={{ color: '#f87171' }}>*</span>
      </div>
      {as === 'textarea'
        ? <textarea {...common} rows={rows} style={{ ...common.style, resize: 'none' }} />
        : <input {...common} type={type} />
      }
    </div>
  )
}

export default function Contact() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setSubmitting(true)
    try {
      const mailtoLink = `mailto:keuye06380618@gmail.com?subject=포트폴리오 문의 from ${encodeURIComponent(form.name)}&body=${encodeURIComponent(`이름: ${form.name}\n이메일: ${form.email}\n\n${form.message}`)}`
      window.location.href = mailtoLink
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" className="about-dot-bg py-24 overflow-hidden">
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
            <span style={{ color: '#e2e8f0' }}>ssh contact@kim-minwoo.dev</span>
          </div>
          <h2
            className="text-4xl sm:text-5xl font-black tracking-tight mb-4 text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #38bdf8 100%)' }}
          >
            연락하기
          </h2>
          <p className="font-mono text-sm" style={{ color: '#555' }}>
            # 협업, 취업 제안, 또는 궁금한 점이 있으시면 언제든지 연락해주세요
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">

          {/* 왼쪽 — SSH 연결 터미널 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
          >
            {/* 크롬 */}
            <div
              className="flex items-center px-4 py-2.5 rounded-t-xl gap-2"
              style={{ background: '#161b22', border: '1px solid #30363d', borderBottom: '1px solid #21262d' }}
            >
              <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
              <span className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
              <span className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
              <span className="flex-1 text-center font-mono text-xs select-none" style={{ color: '#6b7280' }}>
                ssh — contact
              </span>
            </div>

            {/* 바디 */}
            <div
              className="rounded-b-xl p-5 sm:p-6 font-mono text-sm leading-relaxed"
              style={{ background: '#0d1117', border: '1px solid #30363d', borderTop: 'none' }}
            >
              {/* 연결 로그 */}
              <div className="mb-5 text-xs" style={{ color: '#8b949e' }}>
                <div>Connecting to <span style={{ color: '#38bdf8' }}>kim-minwoo.dev</span>...</div>
                <div>Authenticating as <span style={{ color: '#4ade80' }}>chisanw</span>...</div>
                <div>Connection established. <span style={{ color: '#4ade80' }}>✓</span></div>
              </div>

              {/* 구분선 */}
              <div className="mb-4 text-xs" style={{ color: '#30363d' }}>{'─'.repeat(42)}</div>

              {/* 연락처 목록 */}
              <div className="mb-5 space-y-3">
                {CONTACTS.map(({ icon: Icon, label, value, href, color }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-3 group transition-opacity hover:opacity-80"
                  >
                    <span style={{ color: '#6b7280' }} className="w-16 shrink-0">{label}</span>
                    <span style={{ color: '#555' }}>→</span>
                    <Icon className="w-3.5 h-3.5 shrink-0" style={{ color }} />
                    <span className="text-xs group-hover:underline" style={{ color }}>{value}</span>
                  </a>
                ))}
              </div>

              {/* 구분선 */}
              <div className="mb-4 text-xs" style={{ color: '#30363d' }}>{'─'.repeat(42)}</div>

              {/* 상태 */}
              <div className="space-y-1.5 text-xs mb-5">
                <div className="flex items-center gap-2">
                  <span style={{ color: '#6b7280' }}>status</span>
                  <span style={{ color: '#555' }}>→</span>
                  <motion.span
                    className="w-2 h-2 rounded-full"
                    style={{ background: '#4ade80' }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                  />
                  <span style={{ color: '#4ade80' }}>open_to_work</span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ color: '#6b7280' }}>response</span>
                  <span style={{ color: '#555' }}>→</span>
                  <span style={{ color: '#a5d6ff' }}>{'< 24h'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ color: '#6b7280' }}>position</span>
                  <span style={{ color: '#555' }}>→</span>
                  <span style={{ color: '#fbbf24' }}>백엔드 개발자</span>
                </div>
              </div>

              {/* 최종 커서 */}
              <div className="flex items-center text-xs">
                <span style={{ color: '#4ade80' }}>chisanw@contact</span>
                <span style={{ color: '#555' }}>:~$&nbsp;</span>
                <motion.span
                  className="inline-block w-2 h-[1.1em] rounded-[1px] align-text-bottom"
                  style={{ background: '#6366f1' }}
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.85, repeat: Infinity }}
                />
              </div>
            </div>
          </motion.div>

          {/* 오른쪽 — 메시지 폼 터미널 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.22 }}
          >
            {/* 크롬 */}
            <div
              className="flex items-center px-4 py-2.5 rounded-t-xl gap-2"
              style={{ background: '#161b22', border: '1px solid #30363d', borderBottom: '1px solid #21262d' }}
            >
              <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
              <span className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
              <span className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
              <span className="flex-1 text-center font-mono text-xs select-none" style={{ color: '#6b7280' }}>
                send-message.sh — interactive
              </span>
            </div>

            {/* 폼 바디 */}
            <div
              className="rounded-b-xl p-5 sm:p-6"
              style={{ background: '#0d1117', border: '1px solid #30363d', borderTop: 'none' }}
            >
              {/* 커맨드 표시 */}
              <div className="flex items-center gap-1.5 font-mono text-xs mb-5" style={{ color: '#6b7280' }}>
                <span style={{ color: '#4ade80' }}>chisanw@contact</span>
                <span>:~$</span>
                <span style={{ color: '#e2e8f0' }}>./send-message.sh --interactive</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <TerminalInput
                  label="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="홍길동"
                />
                <TerminalInput
                  label="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="hong@example.com"
                />
                <TerminalInput
                  label="message"
                  name="message"
                  as="textarea"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="안녕하세요! 협업 제안이 있어서 연락드립니다..."
                />

                {/* 상태 메시지 */}
                {status === 'success' && (
                  <div className="flex items-center gap-2 font-mono text-xs" style={{ color: '#4ade80' }}>
                    <HiCheckCircle className="w-4 h-4 shrink-0" />
                    exit code: 0 — 메일 앱이 열렸습니다. 감사합니다!
                  </div>
                )}
                {status === 'error' && (
                  <div className="flex items-center gap-2 font-mono text-xs" style={{ color: '#f87171' }}>
                    <HiExclamationCircle className="w-4 h-4 shrink-0" />
                    error: 직접 이메일을 보내주세요.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-mono text-sm font-semibold transition-all disabled:opacity-50"
                  style={{ background: '#6366f1', color: '#fff' }}
                >
                  {submitting ? '$ sending...' : '$ send --confirm'}
                </button>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
