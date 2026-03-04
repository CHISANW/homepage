import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaGithub, FaStar, FaCodeBranch, FaExternalLinkAlt } from 'react-icons/fa'
import { HiRefresh } from 'react-icons/hi'

// ─────────────────────────────────────────────────────────
// ✏️  직접 개발한 프로젝트를 추가하세요!
// ─────────────────────────────────────────────────────────
const FEATURED_PROJECTS = []
// ─────────────────────────────────────────────────────────

const LANG_COLORS = {
  Java:       '#b07219',
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python:     '#3572A5',
  Go:         '#00ADD8',
  Kotlin:     '#A97BFF',
  Shell:      '#89e051',
  HTML:       '#e34c26',
  CSS:        '#563d7c',
  default:    '#8b949e',
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
    <motion.div
      className="rounded-xl overflow-hidden flex flex-col group hover:-translate-y-1 transition-transform duration-200"
      style={{ background: '#0d1117', border: '1px solid #30363d', borderTop: '2px solid #818cf8' }}
    >
      {/* 썸네일 */}
      <div
        className="h-40 flex items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #6366f130, #a855f720)' }}
      >
        {project.image
          ? <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          : <FaGithub className="w-12 h-12" style={{ color: '#30363d' }} />
        }
        <div className="absolute top-2.5 left-3 font-mono text-[10px] px-2 py-0.5 rounded" style={{ background: '#818cf8', color: '#0d1117' }}>
          FEATURED
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 font-mono">
        <div className="text-sm font-bold mb-2" style={{ color: '#79c0ff' }}>{project.title}</div>
        <p className="text-xs leading-relaxed mb-4 flex-1" style={{ color: '#8b949e', fontFamily: 'sans-serif' }}>
          {project.description}
        </p>
        {project.tech?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tech.map(t => (
              <span key={t} className="px-2 py-0.5 text-[10px] rounded" style={{ background: '#1e2433', color: '#38bdf8', border: '1px solid #1e3a5f' }}>
                {t}
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-colors"
              style={{ border: '1px solid #30363d', color: '#8b949e' }}
            >
              <FaGithub className="w-3.5 h-3.5" /> GitHub
            </a>
          )}
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs"
              style={{ background: '#818cf8', color: '#0d1117', fontWeight: 600 }}
            >
              <FaExternalLinkAlt className="w-3 h-3" /> 데모
            </a>
          )}
        </div>
      </div>
    </motion.div>
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
        {/* 헤더 */}
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

        {/* 설명 */}
        <p className="text-xs leading-relaxed flex-1 mb-4 line-clamp-3" style={{ color: '#8b949e', fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
          {repo.description || '// no description'}
        </p>

        {/* 토픽 */}
        {repo.topics?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {repo.topics.slice(0, 4).map(topic => (
              <span key={topic} className="px-2 py-0.5 font-mono text-[10px] rounded" style={{ background: '#1e2433', color: '#818cf8', border: '1px solid #818cf820' }}>
                {topic}
              </span>
            ))}
          </div>
        )}

        {/* 푸터 */}
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

export default function Projects() {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [ref, inView] = useInView({ threshold: 0.05, triggerOnce: true })

  const fetchRepos = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('https://api.github.com/users/CHISANW/repos?sort=updated&per_page=30&type=owner')
      if (!res.ok) throw new Error(`GitHub API ${res.status}`)
      const data = await res.json()
      setRepos(data.filter(r => !r.fork).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRepos() }, [])

  const languages = ['all', ...new Set(repos.map(r => r.language).filter(Boolean))]
  const displayed = filter === 'all' ? repos : repos.filter(r => r.language === filter)

  return (
    <section id="projects" className="about-dot-bg py-24 overflow-hidden">
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
            <span style={{ color: '#e2e8f0' }}>gh repo list CHISANW --limit 30</span>
          </div>
          <h2
            className="text-4xl sm:text-5xl font-black tracking-tight mb-4 text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #38bdf8 100%)' }}
          >
            프로젝트
          </h2>
          <p className="font-mono text-sm" style={{ color: '#555' }}>
            # 직접 개발한 프로젝트와 GitHub 레포지토리입니다
          </p>
        </motion.div>

        {/* Featured Projects */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          {/* 서브헤더 */}
          <div className="flex items-center gap-3 mb-5 font-mono text-xs" style={{ color: '#555' }}>
            <span style={{ color: '#4ade80' }}>#</span>
            <span style={{ color: '#8b949e' }}>주요 프로젝트 (FEATURED)</span>
            <div className="flex-1 h-px" style={{ background: '#1e2433' }} />
          </div>

          {FEATURED_PROJECTS.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURED_PROJECTS.map((p, i) => <FeaturedCard key={i} project={p} />)}
            </div>
          ) : (
            /* 빈 상태 — 터미널 스타일 */
            <div
              className="rounded-xl p-6 font-mono text-sm"
              style={{ background: '#0d1117', border: '1px dashed #30363d' }}
            >
              <div className="flex items-start gap-2 mb-2">
                <span style={{ color: '#4ade80' }}>chisanw@dev:~$</span>
                <span style={{ color: '#e2e8f0' }}>ls featured/</span>
              </div>
              <div style={{ color: '#8b949e' }}>
                ls: cannot access 'featured/': No such file or directory
              </div>
              <div className="mt-3 text-xs" style={{ color: '#555' }}>
                {'// Projects.jsx 상단의 FEATURED_PROJECTS 배열에 프로젝트를 추가하세요.'}
              </div>
            </div>
          )}
        </motion.div>

        {/* GitHub Repos */}
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

          {/* 필터 + 새로고침 */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex flex-wrap gap-2 font-mono text-xs">
              {languages.slice(0, 6).map(lang => (
                <button
                  key={lang}
                  onClick={() => setFilter(lang)}
                  className="px-3 py-1.5 rounded-lg transition-all"
                  style={filter === lang
                    ? { background: '#6366f1', color: '#fff', border: '1px solid #6366f1' }
                    : { background: '#0d1117', color: '#8b949e', border: '1px solid #30363d' }
                  }
                >
                  {lang === 'all' ? '[ all ]' : lang}
                </button>
              ))}
            </div>
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

          {/* 콘텐츠 */}
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
              No repositories found for language: {filter}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayed.map(repo => <RepoCard key={repo.id} repo={repo} />)}
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
