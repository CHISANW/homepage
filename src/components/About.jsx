import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const HIGHLIGHTS = [
  {
    cmd: './backend.sh',
    title: '\uBC31\uC5D4\uB4DC \uAC1C\uBC1C',
    desc: 'Java\uC640 Spring Boot \uAE30\uBC18\uC73C\uB85C REST API\uB97C \uC124\uACC4\uD558\uACE0 \uC6B4\uC601 \uD658\uACBD\uAE4C\uC9C0 \uACE0\uB824\uD574 \uAD6C\uD604\uD569\uB2C8\uB2E4.',
    accent: '#818cf8',
  },
  {
    cmd: './devops.sh',
    title: '\uD074\uB77C\uC6B0\uB4DC & DevOps',
    desc: 'Docker, Kubernetes \uC911\uC2EC\uC73C\uB85C \uBC30\uD3EC \uD30C\uC774\uD504\uB77C\uC778\uC744 \uAD6C\uC131\uD558\uACE0 \uC548\uC815\uC801\uC73C\uB85C \uC6B4\uC601\uD569\uB2C8\uB2E4.',
    accent: '#38bdf8',
  },
  {
    cmd: './database.sh',
    title: '\uB370\uC774\uD130 \uC5D4\uC9C0\uB2C8\uC5B4\uB9C1',
    desc: 'MySQL, Redis, Elasticsearch\uB97C \uD65C\uC6A9\uD574 \uC870\uD68C \uC131\uB2A5\uACFC \uC800\uC7A5 \uAD6C\uC870\uB97C \uD568\uAED8 \uCD5C\uC801\uD654\uD569\uB2C8\uB2E4.',
    accent: '#4ade80',
  },
  {
    cmd: './growth.sh',
    title: '\uC9C0\uC18D\uC801 \uC131\uC7A5',
    desc: '\uAE30\uC220 \uD559\uC2B5\uACFC \uD611\uC5C5 \uD68C\uACE0\uB97C \uD1B5\uD574 \uD300\uC758 \uAC1C\uBC1C \uC0DD\uC0B0\uC131\uACFC \uCF54\uB4DC \uD488\uC9C8\uC744 \uAFB8\uC900\uD788 \uB192\uC785\uB2C8\uB2E4.',
    accent: '#fbbf24',
  },
]

const ENV_VARS = [
  { key: 'CAREER', val: '1\uB144\uCC28', vc: '#a5d6ff' },
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
      <div className="rounded-b-xl border border-t-0 border-[#30363d] bg-[#0d1117] p-4 sm:p-6 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto lg:overflow-x-hidden">
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
    <section id="about" className="about-dot-bg relative py-24">
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
            {'# 1\uB144\uCC28 \uBC31\uC5D4\uB4DC \uAC1C\uBC1C\uC790 \u00B7 Java \u00B7 Spring Boot \u00B7 Cloud Native'}
          </p>
        </motion.div>

        <div className="mb-6 grid gap-5 lg:grid-cols-2">
          <motion.div {...slideUp(0.1)} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}>
            <TerminalWindow title="bio.txt | cat">
              <div className="min-w-0">
                <PromptLine cmd="cat bio.txt" />

                <div className="mb-5 text-[12px] sm:text-[13px] leading-[1.85]" style={{ color: '#8b949e' }}>
                  <p className="mb-2">{`\uC548\uB155\uD558\uC138\uC694. \uC800\uB294 `}<span style={{ color: '#e2e8f0', fontWeight: 600 }}>{'繹먃沃섏눘??}</span>{'\uC785\uB2C8\uB2E4.'}</p>
                  <p className="mb-2">{'Java\uC640 Spring Boot\uB97C \uC8FC\uB825\uC73C\uB85C \uC0AC\uC6A9\uD558\uB294 \uBC31\uC5D4\uB4DC \uAC1C\uBC1C\uC790\uC774\uBA70, \uC548\uC815\uC801\uC774\uACE0 \uD655\uC7A5 \uAC00\uB2A5\uD55C \uC11C\uBE44\uC2A4\uB97C \uB9CC\uB4DC\uB294 \uB370 \uC9D1\uC911\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4.'}</p>
                  <p className="mb-2">{'\uCEE8\uD14C\uC774\uB108 \uAE30\uBC18 \uD074\uB77C\uC6B0\uB4DC \uD658\uACBD\uC5D0\uC11C \uAC1C\uBC1C\uD558\uB294 \uAC83\uC744 \uC120\uD638\uD558\uACE0, \uB370\uC774\uD130 \uACC4\uCE35 \uC131\uB2A5 \uAC1C\uC120\uC5D0\uB3C4 \uC9C0\uC18D\uC801\uC73C\uB85C \uAD00\uC2EC\uC744 \uAC16\uACE0 \uC788\uC2B5\uB2C8\uB2E4.'}</p>
                  <p>{'\uD611\uC5C5\uC5D0\uC11C\uB294 \uBA85\uD655\uD55C \uCEE4\uBBA4\uB2C8\uCF00\uC774\uC158\uACFC \uCC45\uC784 \uC788\uB294 \uC2E4\uD589\uC744 \uAC00\uC7A5 \uC911\uC694\uD558\uAC8C \uC0DD\uAC01\uD569\uB2C8\uB2E4.'}</p>
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
              <div className="min-w-0 text-[12px] sm:text-[13px] leading-[1.85] break-words">
                <PromptLine cmd="vim Developer.java" />
                <div className="mb-2 h-px w-full" style={{ background: '#30363d' }} />

                <div><Kw c="public class" /> <Fn c="Developer" /> {'{'}</div>
                <div className="pl-4"><Kw c="private" /> <Tp c=" String" />{' name = '}<Str c='"繹먃沃섏눘??' />; <Cm c="// Author" /></div>
                <div className="pl-4"><Kw c="private" /> <Tp c=" int" />{' career = '}<span style={{ color: '#79c0ff' }}>1</span>; <Cm c="// years" /></div>
                <div className="pl-4"><Kw c="private" /> <Tp c=" boolean" />{' available = '}<span style={{ color: '#79c0ff' }}>true</span>;</div>
                <div>&nbsp;</div>
                <div className="pl-4"><Kw c="private" /> <Tp c=" String" />{'[] skills = {'}</div>
                <div className="pl-8"><Str c='"Java"' />{', '}<Str c='"Spring Boot"' />{', '}<Str c='"Kubernetes"' />{','}</div>
                <div className="pl-8"><Str c='"Docker"' />{', '}<Str c='"MySQL"' />{', '}<Str c='"Redis"' /></div>
                <div className="pl-4">{'};'}</div>
                <div>&nbsp;</div>
                <div className="pl-4"><Kw c="public" /> <Tp c=" String" /> <Fn c="getMotto" />{'() {'}</div>
                <div className="pl-8"><Kw c="return" /> <Str c='"?꾨뗀諭뜻에?揶쎛燁살꼶? 筌띾슢諭??' />;</div>
                <div className="pl-4">{'}'}</div>
                <div>{'}'}</div>

                <div className="mt-4 flex justify-between rounded-[2px] px-2 py-0.5 text-[11px] font-mono" style={{ background: '#818cf8', color: '#0d1117' }}>
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
              <p className="text-xs leading-relaxed" style={{ color: '#8b949e', fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>{desc}</p>

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
