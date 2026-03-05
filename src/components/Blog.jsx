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

  if (RSS_PROXY) {
    const r0 = await tryFetch(`${RSS_PROXY}?url=${encodeURIComponent(rssUrl)}`, 8000)
    if (r0) return r0.text()
  }

  const r1 = await tryFetch(`https://corsproxy.io/?${encodeURIComponent(rssUrl)}`, 6000)
  if (r1) return r1.text()

  const r2 = await tryFetch(`https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`, 8000)
  if (r2) {
    const data = await r2.json()
    return data.contents ?? null
  }

  return null
}

const CATEGORY_COLORS = {
  Spring: 'bg-green-400/15 text-green-300 border border-green-400/30',
  SpringBoot: 'bg-green-400/15 text-green-300 border border-green-400/30',
  'Spring/SpringBoot': 'bg-green-400/15 text-green-300 border border-green-400/30',
  MySQL: 'bg-sky-400/15 text-sky-300 border border-sky-400/30',
  Devops: 'bg-orange-400/15 text-orange-300 border border-orange-400/30',
  JPA: 'bg-violet-400/15 text-violet-300 border border-violet-400/30',
  default: 'bg-gray-400/15 text-gray-300 border border-gray-400/30',
}

const CATEGORY_BG = {
  Spring: 'from-green-400/25 to-green-700/10',
  SpringBoot: 'from-green-400/25 to-green-700/10',
  'Spring/SpringBoot': 'from-green-400/25 to-green-700/10',
  MySQL: 'from-sky-400/25 to-sky-700/10',
  Devops: 'from-orange-400/25 to-orange-700/10',
  JPA: 'from-violet-400/25 to-violet-700/10',
  default: 'from-gray-400/20 to-gray-700/10',
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
}

const BLOG_STATS = [
  { label: 'posts', value: '105+' },
  { label: 'visitors', value: '62,000+' },
  { label: 'topics', value: 'Spring / MySQL / DevOps' },
]

function getCategoryColor(category) {
  if (!category) return CATEGORY_COLORS.default
  for (const key of Object.keys(CATEGORY_COLORS)) {
    if (category.includes(key)) return CATEGORY_COLORS[key]
  }
  return CATEGORY_COLORS.default
}

function getCategoryBg(category) {
  if (!category) return CATEGORY_BG.default
  for (const key of Object.keys(CATEGORY_BG)) {
    if (category.includes(key)) return CATEGORY_BG[key]
  }
  return CATEGORY_BG.default
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return dateStr
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
      className="group flex flex-col overflow-hidden rounded-xl border border-[#30363d] bg-[#161b22] transition-all duration-200 hover:-translate-y-1 hover:border-indigo-400/60"
    >
      <div className="relative h-44 w-full shrink-0 overflow-hidden bg-[#0d1117]">
        {showImage ? (
          <img
            src={post.thumbnail}
            alt={post.title}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${getCategoryBg(post.category)}`}>
            <HiPhotograph className="h-10 w-10 text-gray-500" />
          </div>
        )}

        <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-sm ${getCategoryColor(post.category)}`}>
          {post.category || 'Blog'}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-gray-100 transition-colors group-hover:text-indigo-300">
          {post.title}
        </h3>

        {post.description && (
          <p className="line-clamp-2 text-xs leading-relaxed text-gray-400">
            {post.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-3 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <HiCalendar className="h-3.5 w-3.5" />
            {formatDate(post.date)}
          </div>
          <HiExternalLink className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
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
        const rssText = await fetchRSSText(`${BLOG_URL}/rss`)
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
            description: new DOMParser().parseFromString(descHtml, 'text/html').body.textContent?.trim()?.slice(0, 100) || '',
          }
        })

        setPosts(parsed)
      } catch {
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <section id="blog" className="hero-dot-bg overflow-hidden py-24">
      <div className="section-container">
        <motion.div ref={ref} variants={containerVariants} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <motion.div variants={itemVariants} className="mb-14 text-center">
            <div className="mb-5 inline-flex items-center gap-1.5 font-mono text-sm text-gray-500">
              <span className="text-indigo-400">chisanw</span>
              <span>@dev:~$</span>
              <span className="text-slate-300">blog list --latest 6</span>
            </div>
            <h2
              className="mb-4 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl"
              style={{ backgroundImage: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #38bdf8 100%)' }}
            >
              Tech Blog
            </h2>
            <p className="font-mono text-sm text-gray-500">
              Consistent technical writing with backend and infrastructure focus.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="overflow-hidden rounded-xl"
            style={{ border: '1px solid #30363d' }}
          >
            <div className="flex items-center justify-between border-b border-[#21262d] bg-[#161b22] px-5 py-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <div className="h-3 w-3 rounded-full bg-[#28c840]" />
                </div>
                <span className="select-none font-mono text-xs text-gray-500">~/blog/back-stead.tistory.com - latest posts</span>
              </div>
              <a
                href={BLOG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-gray-500 transition-colors hover:text-indigo-300"
              >
                open blog
              </a>
            </div>

            <div className="bg-[#0d1117] p-6 sm:p-8">
              <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {BLOG_STATS.map(({ label, value }) => (
                  <div key={label} className="rounded-xl border border-indigo-300/20 bg-indigo-300/10 p-4 font-mono">
                    <div className="text-lg font-bold text-indigo-300">{value}</div>
                    <div className="text-[11px] text-gray-500">{label}</div>
                  </div>
                ))}
              </div>

              {loading ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="overflow-hidden rounded-xl border border-[#30363d] bg-[#161b22] animate-pulse">
                      <div className="h-44 bg-[#0d1117]" />
                      <div className="space-y-3 p-5">
                        <div className="h-3 w-1/3 rounded bg-[#21262d]" />
                        <div className="h-4 w-full rounded bg-[#21262d]" />
                        <div className="h-4 w-4/5 rounded bg-[#21262d]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : posts.length > 0 ? (
                <motion.div variants={containerVariants} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post, i) => (
                    <PostCard key={i} post={post} />
                  ))}
                </motion.div>
              ) : (
                <div className="py-10 text-center text-gray-400">
                  Unable to load RSS posts right now.
                </div>
              )}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-8 text-center">
            <a
              href={BLOG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-2.5 font-mono text-sm text-white transition-transform duration-200 hover:-translate-y-0.5"
            >
              <HiPencil className="h-4 w-4" />
              view all posts
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
