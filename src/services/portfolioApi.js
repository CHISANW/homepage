/**
 * portfolioApi.js
 *
 * 현재: localStorage / sessionStorage 기반 mock 구현
 * 추후: VITE_API_URL 환경변수를 설정하면 실제 서버로 자동 전환됩니다.
 *
 * 서버 연동 시 필요한 엔드포인트:
 *   POST   /api/visitors/visit  → { today: number }
 *   GET    /api/visitors/today  → { today: number }
 *   GET    /api/likes           → { count: number, liked: boolean }
 *   POST   /api/likes           → { count: number, liked: true }
 *   DELETE /api/likes           → { count: number, liked: false }
 *   POST   /api/chat            body: { message: string } → { reply: string }
 */

const API_BASE = import.meta.env.VITE_API_URL // e.g. "https://api.example.com"

// ── Storage Keys ─────────────────────────────────────────
const KEY_VISITOR = 'pf_visitor'
const KEY_LIKE    = 'pf_like'
const KEY_SESSION = 'pf_visited'

// Seed values (서버 연동 전까지 표시되는 기본값)
const SEED_VISITORS = 134
const SEED_LIKES    = 47

// ── 공통 fetch 헬퍼 ──────────────────────────────────────
async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// ══════════════════════════════════════════════════════════
// Visitor API
// ══════════════════════════════════════════════════════════
export const visitorApi = {
  /** 페이지 로드 시 호출. 오늘 방문 수를 반환 */
  async recordVisit() {
    if (API_BASE) {
      try {
        // 1. 방문 기록 (void)
        await fetch(`${API_BASE}/api/admin/visit`, { method: 'POST' })
        // 2. 오늘 방문자 수 조회
        const res = await apiFetch('/api/admin/visit/count')
        return { today: res.data?.count ?? 0 }
      } catch (err) {
        console.error('Visitor record error:', err)
      }
    }
    // --- localStorage fallback ---
    const today   = new Date().toISOString().slice(0, 10)
    const stored  = JSON.parse(localStorage.getItem(KEY_VISITOR) || '{}')
    const already = sessionStorage.getItem(KEY_SESSION)

    if (stored.date !== today) {
      // 날짜가 바뀌면 리셋
      stored.date  = today
      stored.count = SEED_VISITORS
    }
    if (!already) {
      // 이 세션에서 아직 카운트 안 됨
      stored.count = (stored.count ?? SEED_VISITORS) + 1
      sessionStorage.setItem(KEY_SESSION, '1')
    }
    localStorage.setItem(KEY_VISITOR, JSON.stringify(stored))
    return { today: stored.count }
  },

  async getToday() {
    if (API_BASE) {
      try {
        const res = await apiFetch('/api/admin/visit/count')
        return { today: res.data?.count ?? 0 }
      } catch (err) {
        console.error('Visitor count error:', err)
      }
    }
    const today  = new Date().toISOString().slice(0, 10)
    const stored = JSON.parse(localStorage.getItem(KEY_VISITOR) || '{}')
    return { today: stored.date === today ? stored.count : SEED_VISITORS }
  },
}

// ══════════════════════════════════════════════════════════
// Like API
// ══════════════════════════════════════════════════════════
export const likeApi = {
  async getStatus() {
    if (API_BASE) {
      try { return await apiFetch('/api/likes') } catch {}
    }
    const s = JSON.parse(localStorage.getItem(KEY_LIKE) || '{}')
    return { count: s.count ?? SEED_LIKES, liked: s.liked ?? false }
  },

  async toggle(currentlyLiked) {
    if (API_BASE) {
      try {
        return await apiFetch('/api/likes', { method: currentlyLiked ? 'DELETE' : 'POST' })
      } catch {}
    }
    const s       = JSON.parse(localStorage.getItem(KEY_LIKE) || '{}')
    const liked   = !currentlyLiked
    const count   = Math.max(0, (s.count ?? SEED_LIKES) + (liked ? 1 : -1))
    localStorage.setItem(KEY_LIKE, JSON.stringify({ liked, count }))
    return { liked, count }
  },
}

// ══════════════════════════════════════════════════════════
// Chat API
// ══════════════════════════════════════════════════════════
export const chatApi = {
  async send(message) {
    if (API_BASE) {
      try {
        return await apiFetch('/api/chat', {
          method: 'POST',
          body: JSON.stringify({ message }),
        })
      } catch {}
    }
    // 서버 없을 때: 패턴 매칭 로컬 응답
    await new Promise(r => setTimeout(r, 600 + Math.random() * 800))
    return { reply: getLocalReply(message) }
  },
}

// ── 로컬 패턴 매칭 Q&A ──────────────────────────────────
const RULES = [
  {
    patterns: ['안녕', 'hi', 'hello', '반갑', '처음', '헬로'],
    reply: '안녕하세요! 👋\n저는 김민우(CHISANW)의 포트폴리오 챗봇입니다.\n기술 스택, 경력, 연락처 등 무엇이든 물어보세요!',
  },
  {
    patterns: ['기술', '스택', 'java', 'spring', '언어', 'kotlin', 'k8s', 'kubernetes', 'docker', 'redis', 'mysql', 'elastic'],
    reply: '🛠 주력 기술 스택\n\nBackend  : Java, Spring Boot, JPA\nDevOps   : Kubernetes, Docker, GitHub Actions\nDatabase : MySQL, Redis, Elasticsearch\nTools    : Git, Linux, IntelliJ',
  },
  {
    patterns: ['경력', '연차', '몇년', '기간', '얼마나', '신입', '주니어'],
    reply: '📅 현재 1년차 백엔드 개발자입니다.\n성장 중이지만 열정 하나는 누구에게도 지지 않아요! 💪',
  },
  {
    patterns: ['연락', '이메일', '메일', 'email', '전화', '연락처'],
    reply: '📬 연락처\n\nEmail  : keuye06380618@gmail.com\nGitHub : github.com/CHISANW\n\n언제든지 연락해 주세요!',
  },
  {
    patterns: ['github', '깃허브', '레포', '코드', '소스'],
    reply: '🐙 GitHub : github.com/CHISANW\n\n다양한 프로젝트와 코드를 확인하실 수 있어요!',
  },
  {
    patterns: ['블로그', 'blog', '티스토리', '포스트', '글', '기술글'],
    reply: '📝 기술 블로그 : back-stead.tistory.com\n\n현재 105개 이상의 기술 포스트가 있습니다!',
  },
  {
    patterns: ['구직', '취업', '채용', '지원', '일자리', '오픈'],
    reply: '✅ 현재 백엔드 개발자 포지션을 적극적으로 찾고 있습니다!\n\nkeuye06380618@gmail.com 으로 연락 주세요 🙏',
  },
  {
    patterns: ['이름', '누구', '소개', '본인', '너는'],
    reply: '👨‍💻 저는 김민우(CHISANW)입니다!\nJava & Spring Boot 기반 1년차 백엔드 개발자예요.\nCloud Native 환경에서의 개발을 즐깁니다.',
  },
  {
    patterns: ['위치', '어디', '거주', '사는', '어느 나라', '한국'],
    reply: '🇰🇷 대한민국에 거주 중입니다!',
  },
  {
    patterns: ['프로젝트', '작업', '만든', '개발'],
    reply: '🔨 GitHub(github.com/CHISANW)에서 프로젝트를 확인하세요!\n이 포트폴리오 사이트도 직접 개발했어요 ✨',
  },
  {
    patterns: ['도움', '뭐', '무엇', '질문', '물어', '알려', '도와'],
    reply: '💡 이런 것들을 물어볼 수 있어요:\n\n  - 기술 스택\n  - 경력 / 연차\n  - 연락처 / GitHub\n  - 블로그\n  - 구직 상태',
  },
]

function getLocalReply(input) {
  const msg = input.toLowerCase().trim()
  for (const rule of RULES) {
    if (rule.patterns.some(p => msg.includes(p))) return rule.reply
  }
  return '🤔 잘 이해하지 못했어요.\n"기술 스택", "경력", "연락처", "구직" 등을 물어봐 주세요!'
}
