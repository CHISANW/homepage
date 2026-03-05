import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const HIGHLIGHTS = [
  {
    cmd: './backend.sh',
    title: '백엔드 개발',
    desc: 'Java와 Spring Boot 기반으로 REST API를 설계하고 운영 환경까지 고려해 구현합니다.',
    accent: '#818cf8',
  },
  {
    cmd: './devops.sh',
    title: '클라우드 & DevOps',
    desc: 'Docker, Kubernetes 중심으로 배포 파이프라인을 구성하고 안정적으로 운영합니다.',
    accent: '#38bdf8',
  },
  {
    cmd: './database.sh',
    title: '데이터 엔지니어링',
    desc: 'MySQL, Redis, Elasticsearch를 활용해 조회 성능과 저장 구조를 함께 최적화합니다.',
    accent: '#4ade80',
  },
  {
    cmd: './growth.sh',
    title: '지속적 성장',
    desc: '기술 학습과 협업 회고를 통해 팀의 개발 생산성과 코드 품질을 꾸준히 높입니다.',
    accent: '#fbbf24',
  },
]

const ENV_VARS = [
  { key: 'CAREER', val: '1년차', vc: '#a5d6ff' },
  { key: 'LANG', val: 'Java', vc: '#ffa657' },
  { key: 'LOCATION', val: 'Korea, Republic of', vc: '#a5d6ff' },
  { key: 'GITHUB', val: 'CHISANW', vc: '#a5d6ff' },
  { key: 'STATUS', val: 'open_to_work', vc: '#4ade80' },
]

const Kw = ({ c }) => <span style={{ color: '#ff7b72' }}>{c}</span>
const Tp = ({ c }) => <span style={{ color: '#79c0ff' }}>{c}</span>
const Fn = ({ c }) => <span style={{ color: '#d2a8ff' }}>{c}</span>
const Str = ({ c }) => <span style={{ color: '#a5d6ff' }}>{c}</span>
const Cm = ({ c }) => <span style={{ color: '#8b949e' }}>{c}</span>

function TerminalWindow({ title, children, className = '' }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className="flex items-center px-4 py-2.5 gap-2"
        style={{ background: '#161b22', border: '1px solid #30363d', borderBottom: '1px solid #21262d' }}
      >
        <span className="h-3 w-3 rounded-full" style={{ background: '#ff5f57' }} />
        <span className="h-3 w-3 rounded-full" style={{ background: '#febc2e' }} />
        <span className="h-3 w-3 rounded-full" style={{ background: '#28c840' }} />
        <span className="flex-1 truncate text-center font-mono text-xs select-none" style={{ color: '#6b7280' }}>
          {title}
        </span>
      </div>
      <div
        className="rounded-b-xl border border-t-0 border-[#30363d] bg-[#0d1117] p-4 sm:p-6 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto"
      >
        {children}
      </div>
    </div>
  )
}

function PromptLine({ cmd }) {
  return (
    <div className="mb-2 flex flex-wrap items-start text-xs sm:text-sm">
      <span className="mr-1 shrink-0">
        <span style={{ color: '#4ade80' }}>chisanw</span>
        <span style={{ color: '#555' }}>@</span>
        <span style={{ color: '#818cf8' }}>dev</span>
        <span style={{ color: '#555' }}>:~$&nbsp;</span>
      </span>
      <span style={{ color: '#e2e8f0' }}>{cmd}</span>
    </div>
  )
}

const slideUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay },
})

export default function About() {
  const [ref, inView] = useInView({ threshold: 0.05, triggerOnce: true })

  return (
    <section id="about" className="about-dot-bg relative overflow-hidden py-24">
      <div ref={ref} className="section-container relative">
        <motion.div
          className="mb-14 text-center"
          {...slideUp(0)}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        >
          <div className="mb-5 inline-flex items-center gap-1.5 font-mono text-sm" style={{ color: '#6b7280' }}>
            <span style={{ color: '#4ade80' }}>chisanw</span>
            <span>@dev:~$</span>
            <span style={{ color: '#e2e8f0' }}>cat about.md</span>
          </div>

          <h2
            className="mb-4 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl"
            style={{ backgroundImage: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #38bdf8 100%)' }}
          >
            About Me
          </h2>

          <p className="font-mono text-sm" style={{ color: '#555' }}>
            # 1년차 백엔드 개발자 · Java · Spring Boot · Cloud Native
          </p>
        </motion.div>

        <div className="mb-6 grid gap-5 lg:grid-cols-2">
          <motion.div {...slideUp(0.1)} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}>
            <TerminalWindow title="bio.txt | cat">
              <div className="min-w-[280px]">
                <PromptLine cmd="cat bio.txt" />

                <div className="mb-5 text-[12px] sm:text-[13px] leading-[1.85]" style={{ color: '#8b949e' }}>
                  <p className="mb-2">
                    안녕하세요. 저는 <span style={{ color: '#e2e8f0', fontWeight: 600 }}>김민우</span>입니다.
                  </p>
                  <p className="mb-2">
                    Java와 Spring Boot를 주력으로 사용하는 백엔드 개발자이며, 안정적이고 확장 가능한 서비스를 만드는 데 집중하고 있습니다.
                  </p>
                  <p className="mb-2">
                    컨테이너 기반 클라우드 환경에서 개발하는 것을 선호하고, 데이터 계층 성능 개선에도 지속적으로 관심을 갖고 있습니다.
                  </p>
                  <p>협업에서는 명확한 커뮤니케이션과 책임 있는 실행을 가장 중요하게 생각합니다.</p>
                </div>

                <PromptLine cmd="env | grep DEV_" />

                <div className="mb-5 text-[12px] sm:text-[13px]">
                  {ENV_VARS.map(({ key, val, vc }) => (
                    <div key={key} className="leading-[1.9]">
                      <span style={{ color: '#79c0ff' }}>DEV_{key}</span>
                      <span style={{ color: '#555' }}>=</span>
                      <span style={{ color: vc }}>{val}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center text-[12px] sm:text-[13px]">
                  <span style={{ color: '#4ade80' }}>chisanw</span>
                  <span style={{ color: '#555' }}>@dev:~$&nbsp;</span>
                  <motion.span
                    className="inline-block h-[1.1em] w-2 rounded-[1px] align-text-bottom"
                    style={{ background: '#6366f1' }}
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.85, repeat: Infinity }}
                  />
                </div>
              </div>
            </TerminalWindow>
          </motion.div>

          <motion.div {...slideUp(0.22)} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}>
            <TerminalWindow title="Developer.java | vim">
              <div className="min-w-[520px] text-[12px] sm:text-[13px] leading-[1.85]">
                <PromptLine cmd="vim Developer.java" />

                <div className="mb-2 text-[11px]" style={{ color: '#30363d' }}>{'-'.repeat(52)}</div>

                <div><Kw c="public class" /> <Fn c="Developer" /> {'{'}</div>
                <div className="pl-4"><Kw c="private" /> <Tp c=" String" />{' name = '}<Str c='"김민우"' />; <Cm c="// Author" /></div>
                <div className="pl-4"><Kw c="private" /> <Tp c=" int" />{' career = '}<span style={{ color: '#79c0ff' }}>1</span>; <Cm c="// years" /></div>
                <div className="pl-4"><Kw c="private" /> <Tp c=" boolean" />{' available = '}<span style={{ color: '#79c0ff' }}>true</span>;</div>
                <div>&nbsp;</div>
                <div className="pl-4"><Kw c="private" /> <Tp c=" String" />{'[] skills = {'}</div>
                <div className="pl-8"><Str c='"Java"' />{', '}<Str c='"Spring Boot"' />{', '}<Str c='"Kubernetes"' />{','}</div>
                <div className="pl-8"><Str c='"Docker"' />{', '}<Str c='"MySQL"' />{', '}<Str c='"Redis"' /></div>
                <div className="pl-4">{'};'}</div>
                <div>&nbsp;</div>
                <div className="pl-4"><Kw c="public" /> <Tp c=" String" /> <Fn c="getMotto" />{'() {'}</div>
                <div className="pl-8"><Kw c="return" /> <Str c='"코드로 가치를 만든다"' />;</div>
                <div className="pl-4">{'}'}</div>
                <div>
                  {'}'}
                  <motion.span
                    className="ml-0.5 inline-block h-[1em] w-[7px] rounded-[1px] align-text-bottom"
                    style={{ background: '#6366f1', opacity: 0.9 }}
                    animate={{ opacity: [0.9, 0, 0.9] }}
                    transition={{ duration: 0.85, repeat: Infinity }}
                  />
                </div>

                <div
                  className="mt-4 flex justify-between rounded-[2px] px-2 py-0.5 text-[11px] font-mono"
                  style={{ background: '#818cf8', color: '#0d1117' }}
                >
                  <span>-- NORMAL --</span>
                  <span>"Developer.java" 14L, 328B</span>
                </div>
              </div>
            </TerminalWindow>
          </motion.div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map(({ cmd, title, desc, accent }, i) => (
            <motion.div
              key={cmd}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ delay: 0.35 + i * 0.09, duration: 0.4 }}
              className="group rounded-xl p-5 font-mono transition-transform duration-200 hover:-translate-y-1"
              style={{
                background: '#0d1117',
                border: '1px solid #30363d',
                borderTop: `2px solid ${accent}`,
              }}
            >
              <div className="mb-3 flex items-center gap-1.5 text-xs" style={{ color: accent }}>
                <span>$</span>
                <span>{cmd}</span>
              </div>

              <div className="mb-2 text-sm font-bold" style={{ color: '#e2e8f0' }}>{title}</div>

              <p className="text-xs leading-relaxed" style={{ color: '#8b949e', fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
                {desc}
              </p>

              <div className="mt-4 flex items-center gap-1.5 border-t border-[#1e2433] pt-3 text-[10px]" style={{ color: '#555' }}>
                <motion.span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: '#4ade80' }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.3 }}
                />
                exit code: 0
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
