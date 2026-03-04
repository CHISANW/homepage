import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaJava, FaDocker, FaGit, FaAws } from 'react-icons/fa'
import {
  SiSpring, SiKubernetes, SiMysql, SiRedis,
  SiElasticsearch, SiNestjs, SiTypescript,
  SiLinux, SiJenkins, SiIntellijidea, SiPostman, SiSpringboot, SiApachekafka,
} from 'react-icons/si'

const CATEGORIES = [
  {
    label: 'Backend',
    color: '#818cf8',
    comment: '# Java 생태계 중심의 백엔드 개발',
    skills: [
      { name: 'Java',            icon: FaJava,        level: 67 },
      { name: 'Spring Boot',     icon: SiSpringboot,  level: 67 },
      { name: 'Spring Security', icon: SiSpring,      level: 40 },
      { name: 'JPA / Hibernate', icon: FaJava,        level: 54 },
      { name: 'NestJS',          icon: SiNestjs,      level: 55 },
      { name: 'TypeScript',      icon: SiTypescript,  level: 42 },
    ],
  },
  {
    label: 'DevOps & Cloud',
    color: '#38bdf8',
    comment: '# 컨테이너 기반 클라우드 네이티브',
    skills: [
      { name: 'Docker',          icon: FaDocker,        level: 60 },
      { name: 'Kubernetes',      icon: SiKubernetes,    level: 31 },
      { name: 'Jenkins',         icon: SiJenkins,       level: 55 },
      { name: 'AWS',             icon: FaAws,           level: 49 },
      { name: 'Kafka',           icon: SiApachekafka,   level: 30 },
    ],
  },
  {
    label: 'Database',
    color: '#4ade80',
    comment: '# 다양한 데이터 저장소 활용',
    skills: [
      { name: 'MySQL',           icon: SiMysql,         level: 66 },
      { name: 'Redis',           icon: SiRedis,         level: 52 },
      { name: 'Elasticsearch',   icon: SiElasticsearch, level: 40 },
    ],
  },
  {
    label: 'Tools',
    color: '#fbbf24',
    comment: '# 개발 생산성 도구',
    skills: [
      { name: 'Git',             icon: FaGit,           level: 70 },
      { name: 'Linux',           icon: SiLinux,         level: 70 },
      { name: 'IntelliJ IDEA',   icon: SiIntellijidea,  level: 85 },
      { name: 'Postman',         icon: SiPostman,       level: 75 },
    ],
  },
]

function SkillRow({ name, icon: Icon, level, color, delay }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  return (
    <div ref={ref} className="mb-3.5">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2 font-mono text-xs" style={{ color: '#e2e8f0' }}>
          <Icon className="w-3.5 h-3.5 shrink-0" style={{ color }} />
          {name}
        </div>
        <span className="font-mono text-xs tabular-nums" style={{ color: '#6b7280' }}>
          {level}%
        </span>
      </div>
      <div className="h-[3px] rounded-full" style={{ background: '#1e2433' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: color, boxShadow: `0 0 6px ${color}55` }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay }}
        />
      </div>
    </div>
  )
}

export default function Skills() {
  const [ref, inView] = useInView({ threshold: 0.05, triggerOnce: true })

  return (
    <section id="skills" className="hero-dot-bg py-24 overflow-hidden">
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
            <span style={{ color: '#e2e8f0' }}>cat tech-stack.json | jq</span>
          </div>
          <h2
            className="text-4xl sm:text-5xl font-black tracking-tight mb-4 text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #38bdf8 100%)' }}
          >
            Tech Stack
          </h2>
          <p className="font-mono text-sm" style={{ color: '#555' }}>
            # 백엔드 개발을 중심으로 다양한 기술들을 학습하고 활용합니다
          </p>
        </motion.div>

        {/* 터미널 창 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div
            className="flex items-center px-4 py-2.5 rounded-t-xl gap-2"
            style={{ background: '#161b22', border: '1px solid #30363d', borderBottom: '1px solid #21262d' }}
          >
            <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
            <span className="flex-1 text-center font-mono text-xs select-none" style={{ color: '#6b7280' }}>
              tech-stack.json — cat
            </span>
          </div>

          <div
            className="rounded-b-xl p-5 sm:p-8"
            style={{ background: '#0d1117', border: '1px solid #30363d', borderTop: 'none' }}
          >
            {/* 2×2 그리드 */}
            <div className="grid sm:grid-cols-2 gap-8 sm:gap-10">
              {CATEGORIES.map(({ label, color, comment, skills }, ci) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.25 + ci * 0.1 }}
                >
                  {/* 카테고리 헤더 */}
                  <div className="mb-4">
                    <div className="font-mono text-xs mb-1" style={{ color: '#8b949e' }}>
                      {comment}
                    </div>
                    <div
                      className="font-mono text-sm font-bold pb-2"
                      style={{ color, borderBottom: `1px solid ${color}30` }}
                    >
                      [{label}]
                    </div>
                  </div>

                  {skills.map((skill, i) => (
                    <SkillRow
                      key={skill.name}
                      {...skill}
                      color={color}
                      delay={0.3 + ci * 0.1 + i * 0.08}
                    />
                  ))}
                </motion.div>
              ))}
            </div>

            {/* Currently Learning */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.9 }}
              className="mt-7 pt-5 font-mono text-xs flex flex-wrap items-center gap-2"
              style={{ borderTop: '1px solid #1e2433' }}
            >
              <span style={{ color: '#8b949e' }}>{'// TODO: Currently Learning →'}</span>
              {['LLM 🤖', 'RAG 🔍', 'AI Agent 🧠'].map((t, i) => (
                <span
                  key={t}
                  className="px-2.5 py-0.5 rounded"
                  style={{ background: '#1e2433', color: '#fbbf24', border: '1px solid #fbbf2430' }}
                >
                  {t}
                </span>
              ))}
              <motion.span
                className="inline-block w-1.5 h-[1em] rounded-[1px] align-text-bottom"
                style={{ background: '#6366f1' }}
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.85, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
