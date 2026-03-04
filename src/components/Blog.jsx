import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { HiPencil, HiExternalLink, HiCalendar, HiPhotograph } from 'react-icons/hi'

const BLOG_URL = 'https://back-stead.tistory.com'

const RSS_PROXY = import.meta.env.VITE_RSS_PROXY_URL

async function fetchRSSText(rssUrl) {
  const tryFetch = async (url, timeoutMs) => {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const res = await fetch(url, { signal: controller.signal })
      clearTimeout(id)
      if (!res.ok) return null
      return res
    } catch {
      clearTimeout(id)
      return null
    }
  }

  // 0순위: Cloudflare Worker 프록시 (환경변수로 설정)
  if (RSS_PROXY) {
    const r0 = await tryFetch(`${RSS_PROXY}?url=${encodeURIComponent(rssUrl)}`, 8000)
    if (r0) return r0.text()
  }

  // 1순위: corsproxy.io (raw XML 반환)
  const r1 = await tryFetch(`https://corsproxy.io/?${encodeURIComponent(rssUrl)}`, 6000)
  if (r1) return r1.text()

  // 2순위: allorigins (JSON 래핑)
  const r2 = await tryFetch(`https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`, 8000)
  if (r2) {
    const data = await r2.json()
    return data.contents ?? null
  }

  return null
}

const CATEGORY_COLORS = {
  'Spring': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  'SpringBoot': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  'Spring/SpringBoot': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  'MySQL': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  'Devops': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
  'Devops/도커': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
  'JPA': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  '성능 개선': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  'default': 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
}

const CATEGORY_BG = {
  'Spring': 'from-green-400/20 to-green-600/10',
  'SpringBoot': 'from-green-400/20 to-green-600/10',
  'Spring/SpringBoot': 'from-green-400/20 to-green-600/10',
  'MySQL': 'from-blue-400/20 to-blue-600/10',
  'Devops': 'from-orange-400/20 to-orange-600/10',
  'Devops/도커': 'from-orange-400/20 to-orange-600/10',
  'JPA': 'from-purple-400/20 to-purple-600/10',
  '성능 개선': 'from-red-400/20 to-red-600/10',
  'default': 'from-gray-300/20 to-gray-400/10',
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

function getCategoryColor(category) {
  if (!category) return CATEGORY_COLORS['default']
  for (const key of Object.keys(CATEGORY_COLORS)) {
    if (category.includes(key)) return CATEGORY_COLORS[key]
  }
  return CATEGORY_COLORS['default']
}

function getCategoryBg(category) {
  if (!category) return CATEGORY_BG['default']
  for (const key of Object.keys(CATEGORY_BG)) {
    if (category.includes(key)) return CATEGORY_BG[key]
  }
  return CATEGORY_BG['default']
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

function extractThumbnail(descriptionHtml) {
  try {
    const doc = new DOMParser().parseFromString(descriptionHtml, 'text/html')
    const img = doc.querySelector('img')
    return img?.getAttribute('src') || null
  } catch {
    return null
  }
}

function PostCard({ post }) {
  const [imgError, setImgError] = useState(false)
  const showImage = post.thumbnail && !imgError

  return (
    <motion.a
      variants={itemVariants}
      href={post.link}
      target="_blank"
      rel="noopener noreferrer"
      className="card flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="relative w-full h-44 shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-800">
        {showImage ? (
          <img
            src={post.thumbnail}
            alt={post.title}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${getCategoryBg(post.category)} flex items-center justify-center`}>
            <HiPhotograph className="w-10 h-10 text-gray-300 dark:text-gray-600" />
          </div>
        )}
        {/* 카테고리 배지 (이미지 위에 오버레이) */}
        <span className={`absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm ${getCategoryColor(post.category)}`}>
          {post.category || 'Blog'}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-5 flex-1">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug
                       group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
          {post.title}
        </h3>

        {post.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {post.description}
          </p>
        )}

        <div className="mt-auto pt-3 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
          <div className="flex items-center gap-1.5">
            <HiCalendar className="w-3.5 h-3.5" />
            {formatDate(post.date)}
          </div>
          <HiExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary-500" />
        </div>
      </div>
    </motion.a>
  )
}

export default function Blog() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const rssText = await fetchRSSText(BLOG_URL + '/rss')
        if (!rssText) throw new Error('RSS unavailable')

        const xml = new DOMParser().parseFromString(rssText, 'text/xml')
        const items = Array.from(xml.querySelectorAll('item')).slice(0, 6)

        const parsed = items.map((item) => {
          const descHtml = item.querySelector('description')?.textContent || ''
          return {
            title: item.querySelector('title')?.textContent || '',
            link: item.querySelector('link')?.textContent || BLOG_URL,
            date: item.querySelector('pubDate')?.textContent || '',
            category: item.querySelector('category')?.textContent || '',
            thumbnail: extractThumbnail(descHtml),
            description: new DOMParser()
              .parseFromString(descHtml, 'text/html')
              .body.textContent
              ?.trim()
              ?.slice(0, 100) || '',
          }
        })
        setPosts(parsed)
      } catch {
        // 두 프록시 모두 실패 시 빈 배열 유지
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  return (
    <section id="blog" className="py-24 bg-gray-50 dark:bg-gray-900/50">
      <div className="section-container">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <span className="tag mb-4">
              <HiPencil className="w-3.5 h-3.5" />
              Blog
            </span>
            <h2 className="section-title mt-4">기술 블로그</h2>
            <p className="section-subtitle">
              <a
                href={BLOG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary-600 dark:text-primary-400 hover:underline"
              >
                A steady developer
              </a>
              &nbsp;— 하루 한권 책으로 떠나는 개발여행
            </p>
          </motion.div>

          {/* Blog stats */}
          <motion.div variants={itemVariants} className="flex justify-center gap-8 mb-10">
            {[
              { label: '총 게시글', value: '105+' },
              { label: '누적 방문자', value: '62,000+' },
              { label: '주요 주제', value: 'Spring · MySQL · DevOps' },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</div>
              </div>
            ))}
          </motion.div>

          {/* Posts grid */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card overflow-hidden animate-pulse">
                  <div className="h-44 bg-gray-200 dark:bg-gray-700" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <motion.div
              variants={containerVariants}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {posts.map((post, i) => (
                <PostCard key={i} post={post} />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              <p className="mb-3">포스트를 불러오지 못했습니다.</p>
            </div>
          )}

          {/* CTA */}
          <motion.div variants={itemVariants} className="text-center mt-10">
            <a
              href={BLOG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex"
            >
              <HiPencil className="w-5 h-5" />
              블로그 전체 보기
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
