import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaGithub, FaStar, FaCodeBranch, FaExternalLinkAlt, FaGooglePlay, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { HiRefresh } from 'react-icons/hi'

// 직접 개발/참여한 대표 프로젝트를 카드로 노출
const FEATURED_PROJECTS = [
  {
    title: 'Hambug',
    description: '실제 서비스 중인 안드로이드 앱입니다. 백엔드 API 개발과 서버 인프라 구축을 담당했습니다.',
    tech: ['Spring Boot', 'Kubernetes', 'Docker', 'MySQL', 'Redis'],
    image: '/hambug.png',
    imageFit: 'contain',
    store: 'https://play.google.com/store/apps/details?id=desktop.hambug&hl=ko',
    github: 'https://github.com/HambugDev/Hambug-Backend',
    badge: 'Google Play',
    badgeColor: '#01875f',
    gradient: 'linear-gradient(135deg, #01875f20, #34d39920)',
    accent: '#01875f',
  },
  {
    title: 'SIMVEX Runtime',
    description: '캡스톤 프로젝트로, 공학 전공자들의 기계 학습 이해를 돕는 3D 물리 시뮬레이터 웹 서비스입니다.',
    tech: ['NestJS', 'Next.js', 'TypeScript', 'Vercel'],
    image: '/simvex.png',
    imageFit: 'cover',
    demo: 'https://runtime-simvex.vercel.app/',
    github: 'https://github.com/team-blaybus-runtime/back',
    badge: 'Hackathon',
    badgeColor: '#7c3aed',
    gradient: 'linear-gradient(135deg, #7c3aed20, #38bdf820)',
    accent: '#818cf8',
  },
  {
    title: 'Healica Survey',
    description: '헬스케어 설문 기반 사용자 입력을 수집하고 결과 흐름을 제공하는 웹 프로젝트입니다.',
    tech: ['React', 'Vite', 'JavaScript', 'Vercel'],
    imageFit: 'cover',
    demo: 'https://healica.vercel.app/',
    github: 'https://github.com/CHISANW/helica-survey',
    badge: 'Web App',
    badgeColor: '#2563eb',
    gradient: 'linear-gradient(135deg, #2563eb20, #06b6d420)',
    accent: '#38bdf8',
  },
]

const LANG_COLORS = {
  Java: '#b07219',
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Go: '#00ADD8',
  Kotlin: '#A97BFF',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
  default: '#8b949e',
}

function TerminalChrome({ title }) {
  return (
    <div
      className="flex items-center px-4 py-2.5 gap-2"
      style={{ background: '#161b22', borderBottom: '1px solid #21262d' }}
    >
      <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
      <span className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
      <span className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
      <span className="flex-1 text-center font-mono text-xs select-none" style={{ color: '#6b7280' }}>
        {title}
      </span>
    </div>
  )
}

function FeaturedCard({ project }) {
  return (
    <div
      className="relative flex-shrink-0 w-72 sm:w-80 rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: '#0d1117',
        border: '1px solid #30363d',
        height: 260,
      }}
    >
      <div
        className="h-24 flex items-center justify-center relative overflow-hidden"
        style={{ background: project.gradient }}
      >
        {project.image
          ? project.imageFit === 'cover'
            ? <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
            : <img src={project.image} alt={project.title} className="h-14 w-14 object-contain" />
          : <FaGooglePlay className="w-10 h-10" style={{ color: project.accent }} />
        }

        <div
          className="absolute top-3 left-3 font-mono text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1"
          style={{ background: project.badgeColor, color: '#fff' }}
        >
          <FaGooglePlay className="w-2.5 h-2.5" />
          {project.badge}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 font-mono">
        <div className="text-sm font-bold mb-1.5" style={{ color: '#e2e8f0' }}>
          {project.title}
        </div>
        <p
          className="text-[11px] leading-relaxed mb-3 flex-1 line-clamp-2"
          style={{ color: '#8b949e', fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}
        >
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          {project.tech.slice(0, 4).map((t) => (
            <span
              key={t}
              className="px-1.5 py-0.5 text-[9px] rounded"
              style={{ background: '#1e2433', color: '#818cf8', border: '1px solid #818cf820' }}
            >
              {t}
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          {project.store && (
            <a
              href={project.store}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-semibold transition-opacity hover:opacity-80"
              style={{ background: project.badgeColor, color: '#fff' }}
            >
              <FaGooglePlay className="w-3 h-3" /> 스토어
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-semibold transition-opacity hover:opacity-80"
              style={{ background: project.badgeColor, color: '#fff' }}
            >
              <FaExternalLinkAlt className="w-3 h-3" /> 바로가기
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-[11px] transition-colors hover:border-gray-500"
              style={{ border: '1px solid #30363d', color: '#8b949e' }}
            >
              <FaGithub className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function FeaturedCarousel() {
  const trackRef = useRef(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  const CARD_W = 320 + 16

  const updateArrows = () => {
    const el = trackRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    updateArrows()
    el.addEventListener('scroll', updateArrows, { passive: true })
    return () => el.removeEventListener('scroll', updateArrows)
  }, [])

  const scroll = (dir) => {
    trackRef.current?.scrollBy({ left: dir * CARD_W, behavior: 'smooth' })
  }

  if (FEATURED_PROJECTS.length === 0) return null

  return (
    <div className="relative">
      {canLeft && (
        <button
          onClick={() => scroll(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-colors"
          style={{ background: '#161b22', border: '1px solid #30363d', color: '#8b949e' }}
        >
          <FaChevronLeft className="w-3 h-3" />
        </button>
      )}
      {canRight && (
        <button
          onClick={() => scroll(1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-colors"
          style={{ background: '#161b22', border: '1px solid #30363d', color: '#8b949e' }}
        >
          <FaChevronRight className="w-3 h-3" />
        </button>
      )}

      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {FEATURED_PROJECTS.map((p, i) => (
          <FeaturedCard key={i} project={p} />
        ))}
      </div>
    </div>
  )
}

function RepoCard({ repo }) {
  const langColor = LANG_COLORS[repo.language] || LANG_COLORS.default
  return (
    <motion.div
      className="rounded-xl flex flex-col h-full group hover:-translate-y-0.5 transition-transform duration-200"
      style={{
        background: '#0d1117',
        border: '1px solid #30363d',
        borderTop: repo.language ? `2px solid ${langColor}` : '2px solid #30363d',
      }}
    >
      <div className="p-5 flex flex-col h-full">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <FaGithub className="w-4 h-4 shrink-0" style={{ color: '#6b7280' }} />
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm font-semibold truncate hover:underline"
              style={{ color: '#79c0ff' }}
            >
              {repo.name}
            </a>
          </div>
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 transition-colors"
            style={{ color: '#6b7280' }}
          >
            <FaExternalLinkAlt className="w-3 h-3" />
          </a>
        </div>

        <p
          className="text-xs leading-relaxed flex-1 mb-4 line-clamp-3"
          style={{ color: '#8b949e', fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}
        >
          {repo.description || '// no description'}
        </p>

        {repo.topics?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {repo.topics.slice(0, 4).map((topic) => (
              <span
                key={topic}
                className="px-2 py-0.5 font-mono text-[10px] rounded"
                style={{ background: '#1e2433', color: '#818cf8', border: '1px solid #818cf820' }}
              >
                {topic}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid #1e2433' }}>
          <div className="flex items-center gap-3">
            {repo.language && (
              <div className="flex items-center gap-1.5 font-mono text-[11px]" style={{ color: '#8b949e' }}>
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: langColor }} />
                {repo.language}
              </div>
            )}
            {repo.stargazers_count > 0 && (
              <div className="flex items-center gap-1 font-mono text-[11px]" style={{ color: '#8b949e' }}>
                <FaStar className="w-3 h-3" style={{ color: '#fbbf24' }} />
                {repo.stargazers_count}
              </div>
            )}
            {repo.forks_count > 0 && (
              <div className="flex items-center gap-1 font-mono text-[11px]" style={{ color: '#8b949e' }}>
                <FaCodeBranch className="w-3 h-3" />
                {repo.forks_count}
              </div>
            )}
          </div>
          <span className="font-mono text-[10px]" style={{ color: '#555' }}>
            {new Date(repo.updated_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short' })}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

// 고정 표시할 레포 목록 (owner/repo 형식)
const PINNED_REPOS = [
  'Team9994/commitbody-back',
  'CHISANW/algorithm',
  'Teeeeeeeam/Recipe-BE',
  'CHISANW/message-board',
  'HambugDev/Hambug-Backend',
]

export default function Projects() {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [ref, inView] = useInView({ threshold: 0.05, triggerOnce: true })

  const fetchRepos = async () => {
    setLoading(true)
    setError(null)
    try {
      const results = await Promise.all(
        PINNED_REPOS.map((path) =>
          fetch(`https://api.github.com/repos/${path}`).then((r) => {
            if (!r.ok) throw new Error(`${path}: ${r.status}`)
            return r.json()
          }),
        ),
      )
      setRepos(results)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRepos()
  }, [])

  const displayed = repos

  return (
    <section id="projects" className="about-dot-bg py-24 overflow-hidden">
      <div ref={ref} className="section-container">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45 }}
        >
          <div className="inline-flex items-center gap-1.5 font-mono text-sm mb-5" style={{ color: '#6b7280' }}>
            <span style={{ color: '#4ade80' }}>chisanw</span>
            <span>@dev:~$</span>
            <span style={{ color: '#e2e8f0' }}>gh repo list --pinned --limit 5</span>
          </div>
          <h2
            className="text-4xl sm:text-5xl font-black tracking-tight mb-4 text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #38bdf8 100%)' }}
          >
            Projects
          </h2>
          <p className="font-mono text-sm" style={{ color: '#555' }}>
            # Projects I have built and contributed to
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-5 font-mono text-xs" style={{ color: '#555' }}>
            <span style={{ color: '#4ade80' }}>#</span>
            <span style={{ color: '#8b949e' }}>Featured Projects</span>
            <div className="flex-1 h-px" style={{ background: '#1e2433' }} />
          </div>

          <FeaturedCarousel />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-5 font-mono text-xs" style={{ color: '#555' }}>
            <span style={{ color: '#38bdf8' }}>#</span>
            <span style={{ color: '#8b949e' }}>GitHub 레포지토리</span>
            <div className="flex-1 h-px" style={{ background: '#1e2433' }} />
          </div>

          <div className="flex justify-end mb-6">
            <button
              onClick={fetchRepos}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-all disabled:opacity-50"
              style={{ background: '#0d1117', color: '#8b949e', border: '1px solid #30363d' }}
            >
              <HiRefresh className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              $ reload
            </button>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-xl p-5 animate-pulse" style={{ background: '#0d1117', border: '1px solid #30363d' }}>
                  <div className="h-3 rounded mb-3 w-3/4" style={{ background: '#1e2433' }} />
                  <div className="h-2 rounded mb-2" style={{ background: '#161b22' }} />
                  <div className="h-2 rounded w-4/5" style={{ background: '#161b22' }} />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-xl p-8 text-center font-mono text-sm" style={{ background: '#0d1117', border: '1px solid #30363d' }}>
              <div className="mb-2" style={{ color: '#f87171' }}>Error: {error}</div>
              <button onClick={fetchRepos} className="px-4 py-2 rounded-lg text-xs mt-2" style={{ background: '#6366f1', color: '#fff' }}>
                $ retry
              </button>
            </div>
          ) : displayed.length === 0 ? (
            <div className="rounded-xl p-8 text-center font-mono text-sm" style={{ background: '#0d1117', border: '1px solid #30363d', color: '#8b949e' }}>
              고정 레포지토리를 찾지 못했습니다.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayed.map((repo) => <RepoCard key={repo.id} repo={repo} />)}
            </div>
          )}

          {!loading && !error && (
            <div className="text-center mt-10">
              <a
                href="https://github.com/CHISANW"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-sm transition-colors"
                style={{ border: '1px solid #30363d', color: '#8b949e', background: '#0d1117' }}
              >
                <FaGithub className="w-4 h-4" />
                $ gh browse CHISANW
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
