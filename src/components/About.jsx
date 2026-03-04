import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const HIGHLIGHTS = [
  {
    cmd:    './backend.sh',
    title:  '백엔드 개발',
    desc:   'Java & Spring Boot 기반 RESTful API 설계 및 구현. 성능 최적화와 코드 품질을 중요하게 생각합니다.',
    accent: '#818cf8',
  },
  {
    cmd:    './devops.sh',
    title:  '클라우드 & DevOps',
    desc:   'Docker 컨테이너화와 Kubernetes 오케스트레이션으로 안정적인 배포 파이프라인을 구성합니다.',
    accent: '#38bdf8',
  },
  {
    cmd:    './database.sh',
    title:  '데이터 엔지니어링',
    desc:   'MySQL, Redis, Elasticsearch를 활용한 효율적인 데이터 저장 및 검색 시스템을 구축합니다.',
    accent: '#4ade80',
  },
  {
    cmd:    './growth.sh',
    title:  '지속적 성장',
    desc:   '새로운 기술 트렌드를 빠르게 학습하고 팀과의 협업을 통해 더 나은 솔루션을 만들어 나갑니다.',
    accent: '#fbbf24',
  },
]

const ENV_VARS = [
  { key: 'CAREER',   val: '1년차',              vc: '#a5d6ff' },
  { key: 'LANG',     val: 'Java',               vc: '#ffa657' },
  { key: 'LOCATION', val: 'Korea, Republic of', vc: '#a5d6ff' },
  { key: 'GITHUB',   val: 'CHISANW',            vc: '#a5d6ff' },
  { key: 'STATUS',   val: 'open_to_work ✓',     vc: '#4ade80' },
]

// 문법 색상 헬퍼
const Kw  = ({ c }) => <span style={{ color: '#ff7b72' }}>{c}</span>
const Tp  = ({ c }) => <span style={{ color: '#79c0ff' }}>{c}</span>
const Fn  = ({ c }) => <span style={{ color: '#d2a8ff' }}>{c}</span>
const Str = ({ c }) => <span style={{ color: '#a5d6ff' }}>{c}</span>
const Cm  = ({ c }) => <span style={{ color: '#8b949e' }}>{c}</span>

function TerminalWindow({ title, children, className = '' }) {
  return (
    <div className={className}>
      <div
        className="flex items-center px-4 py-2.5 rounded-t-xl gap-2"
        style={{ background: '#161b22', border: '1px solid #30363d', borderBottom: '1px solid #21262d' }}
      >
        <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
        <span className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
        <span className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
        <span className="flex-1 text-center font-mono text-xs select-none" style={{ color: '#6b7280' }}>
          {title}
        </span>
      </div>
      <div
        className="rounded-b-xl p-5 sm:p-6 font-mono text-sm leading-relaxed"
        style={{ background: '#0d1117', border: '1px solid #30363d', borderTop: 'none' }}
      >
        {children}
      </div>
    </div>
  )
}

function PromptLine({ cmd }) {
  return (
    <div className="flex items-start flex-wrap mb-2 select-none">
      <span className="shrink-0 mr-1">
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
  const [ref, inView] = useInView({ threshold: 0.08, triggerOnce: true })

  return (
    <section id="about" className="about-dot-bg relative py-24 overflow-hidden">
      <div ref={ref} className="section-container relative">

        {/* ── 섹션 헤더 ── */}
        <motion.div
          className="text-center mb-14"
          {...slideUp(0)}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        >
          <div className="inline-flex items-center gap-1.5 font-mono text-sm mb-5" style={{ color: '#6b7280' }}>
            <span style={{ color: '#4ade80' }}>chisanw</span>
            <span>@dev:~$</span>
            <span style={{ color: '#e2e8f0' }}>cat about.md</span>
          </div>

          <h2
            className="text-4xl sm:text-5xl font-black tracking-tight mb-4 text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #38bdf8 100%)' }}
          >
            저를 소개합니다
          </h2>

          <p className="font-mono text-sm" style={{ color: '#555' }}>
            # 1년차 백엔드 개발자 · Java · Spring Boot · Cloud Native
          </p>
        </motion.div>

        {/* ── 두 터미널 창 ── */}
        {inView && (
          <div className="grid lg:grid-cols-2 gap-5 mb-6">

            {/* 왼쪽: bio.txt + env */}
            <motion.div {...slideUp(0.1)}>
              <TerminalWindow title="bio.txt — cat">
                <PromptLine cmd="cat bio.txt" />

                <div className="mb-5 text-[13px] leading-[1.85]" style={{ color: '#8b949e' }}>
                  <p className="mb-2">
                    안녕하세요! 저는{' '}
                    <span style={{ color: '#e2e8f0', fontWeight: 600 }}>김민우</span>입니다.
                  </p>
                  <p className="mb-2">
                    Java와 Spring Boot를 주력으로 사용하는 백엔드 개발자로,
                    견고하고 확장 가능한 서비스를 만드는 것에 열정을 가지고 있습니다.
                  </p>
                  <p className="mb-2">
                    컨테이너 기반의 클라우드 환경에서 개발하는 것을 즐기며,
                    Redis와 Elasticsearch를 활용한 성능 최적화에도 관심이 많습니다.
                  </p>
                  <p>
                    항상 더 나은 코드를 작성하기 위해 고민하며,
                    팀원들과의 적극적인 소통을 지향합니다.
                  </p>
                </div>

                <PromptLine cmd="env | grep DEV_" />

                <div className="mb-5 text-[13px]">
                  {ENV_VARS.map(({ key, val, vc }) => (
                    <div key={key} className="leading-[1.9]">
                      <span style={{ color: '#79c0ff' }}>DEV_{key}</span>
                      <span style={{ color: '#555' }}>=</span>
                      <span style={{ color: vc }}>{val}</span>
                    </div>
                  ))}
                </div>

                {/* 최종 커서 */}
                <div className="flex items-center text-[13px]">
                  <span style={{ color: '#4ade80' }}>chisanw</span>
                  <span style={{ color: '#555' }}>@dev:~$&nbsp;</span>
                  <motion.span
                    className="inline-block w-2 h-[1.1em] rounded-[1px] align-text-bottom"
                    style={{ background: '#6366f1' }}
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.85, repeat: Infinity }}
                  />
                </div>
              </TerminalWindow>
            </motion.div>

            {/* 오른쪽: Developer.java (vim 스타일) */}
            <motion.div {...slideUp(0.22)}>
              <TerminalWindow title="Developer.java — vim">
                <PromptLine cmd="vim Developer.java" />

                {/* vim 상단 구분선 */}
                <div className="text-[11px] mb-2" style={{ color: '#30363d' }}>
                  {'─'.repeat(48)}
                </div>

                {/* 코드 */}
                <div className="text-[12px] sm:text-[13px] leading-[1.85] overflow-x-auto">
                  {/* line 1 */}
                  <div><Kw c="public class" /> <Fn c=" Developer" /> {'{'}</div>
                  {/* line 2 */}
                  <div className="pl-4">
                    <Kw c="private" /> <Tp c=" String" />
                    {'  name      = '}<Str c='"김민우"' />;{'  '}
                    <Cm c="// Author" />
                  </div>
                  {/* line 3 */}
                  <div className="pl-4">
                    <Kw c="private" /> <Tp c=" int" />
                    {'     career    = '}<span style={{ color: '#79c0ff' }}>1</span>;{'     '}
                    <Cm c="// years" />
                  </div>
                  {/* line 4 */}
                  <div className="pl-4">
                    <Kw c="private" /> <Tp c=" boolean" />
                    {' available = '}<span style={{ color: '#79c0ff' }}>true</span>;
                  </div>
                  {/* line 5 - blank */}
                  <div>&nbsp;</div>
                  {/* line 6 */}
                  <div className="pl-4">
                    <Kw c="private" /> <Tp c=" String" />
                    {'[] skills = {'}
                  </div>
                  {/* line 7 */}
                  <div className="pl-8">
                    <Str c='"Java"' />{', '}<Str c='"Spring Boot"' />{', '}
                    <Str c='"Kubernetes"' />{','}
                  </div>
                  {/* line 8 */}
                  <div className="pl-8">
                    <Str c='"Docker"' />{', '}<Str c='"MySQL"' />{', '}
                    <Str c='"Redis"' />
                  </div>
                  {/* line 9 */}
                  <div className="pl-4">{'};\n'}</div>
                  {/* line 10 - blank */}
                  <div>&nbsp;</div>
                  {/* line 11 */}
                  <div className="pl-4">
                    <Kw c="public" /> <Tp c=" String" /> <Fn c=" getMotto" />{'() {'}
                  </div>
                  {/* line 12 */}
                  <div className="pl-8">
                    <Kw c="return" /> <Str c=' "코드로 가치를 만든다"' />;
                  </div>
                  {/* line 13 */}
                  <div className="pl-4">{'}'}</div>
                  {/* line 14 */}
                  <div>
                    {'}'}
                    <motion.span
                      className="inline-block w-[7px] h-[1em] ml-0.5 align-text-bottom rounded-[1px]"
                      style={{ background: '#6366f1', opacity: 0.9 }}
                      animate={{ opacity: [0.9, 0, 0.9] }}
                      transition={{ duration: 0.85, repeat: Infinity }}
                    />
                  </div>
                </div>

                {/* vim 상태바 */}
                <div
                  className="mt-4 px-2 py-0.5 text-[11px] font-mono flex justify-between"
                  style={{ background: '#818cf8', color: '#0d1117', borderRadius: 2 }}
                >
                  <span>-- NORMAL --</span>
                  <span>"Developer.java"  14L, 328B</span>
                </div>
              </TerminalWindow>
            </motion.div>
          </div>
        )}

        {/* ── 하이라이트 카드 4개 ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {HIGHLIGHTS.map(({ cmd, title, desc, accent }, i) => (
            <motion.div
              key={cmd}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ delay: 0.35 + i * 0.09, duration: 0.4 }}
              className="rounded-xl p-5 font-mono group hover:-translate-y-1 transition-transform duration-200"
              style={{
                background: '#0d1117',
                border: '1px solid #30363d',
                borderTop: `2px solid ${accent}`,
              }}
            >
              {/* $ 명령어 */}
              <div className="text-xs mb-3 flex items-center gap-1.5" style={{ color: accent }}>
                <span>$</span>
                <span>{cmd}</span>
              </div>

              {/* 제목 */}
              <div
                className="text-sm font-bold mb-2"
                style={{ color: '#e2e8f0', fontFamily: 'inherit' }}
              >
                {title}
              </div>

              {/* 설명 */}
              <p
                className="text-xs leading-relaxed"
                style={{ color: '#8b949e', fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}
              >
                {desc}
              </p>

              {/* 하단 상태 */}
              <div className="mt-4 pt-3 flex items-center gap-1.5 text-[10px]" style={{ borderTop: '1px solid #1e2433', color: '#555' }}>
                <motion.span
                  className="w-1.5 h-1.5 rounded-full"
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
