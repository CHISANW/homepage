import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { chatApi } from '../services/portfolioApi'

const WELCOME = {
  id: 0,
  from: 'bot',
  text: '안녕하세요! 👋\n저는 김민우의 포트폴리오 챗봇입니다.\n기술 스택, 경력, 연락처 등 무엇이든 물어보세요!',
}

const SUGGESTIONS = ['기술 스택', '경력', '연락처', '구직 중?']

let msgId = 1

function Message({ msg }) {
  const isBot = msg.from === 'bot'
  return (
    <div className={`flex gap-2.5 ${isBot ? '' : 'flex-row-reverse'}`}>
      {/* 아바타 */}
      <div
        className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center font-mono text-[10px] font-bold mt-0.5"
        style={isBot
          ? { background: '#6366f120', border: '1px solid #6366f140', color: '#818cf8' }
          : { background: '#4ade8020', border: '1px solid #4ade8040', color: '#4ade80' }
        }
      >
        {isBot ? 'AI' : 'ME'}
      </div>

      {/* 말풍선 */}
      <div
        className="max-w-[75%] px-3.5 py-2.5 rounded-xl font-mono text-xs leading-[1.7] whitespace-pre-wrap"
        style={isBot
          ? { background: '#161b22', border: '1px solid #30363d', color: '#e2e8f0' }
          : { background: '#6366f1', color: '#fff' }
        }
      >
        {msg.text}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-2.5">
      <div
        className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center font-mono text-[10px] font-bold"
        style={{ background: '#6366f120', border: '1px solid #6366f140', color: '#818cf8' }}
      >
        AI
      </div>
      <div
        className="px-3.5 py-3 rounded-xl flex items-center gap-1"
        style={{ background: '#161b22', border: '1px solid #30363d' }}
      >
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: '#818cf8' }}
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  )
}

export default function ChatBot() {
  const [open, setOpen]       = useState(false)
  const [hasNew, setHasNew]   = useState(true)
  const [msgs, setMsgs]       = useState([WELCOME])
  const [input, setInput]     = useState('')
  const [typing, setTyping]   = useState(false)
  const bottomRef             = useRef(null)
  const inputRef              = useRef(null)

  // 새 메시지 왔을 때 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, typing])

  // 열면 unread 초기화 + input 포커스
  useEffect(() => {
    if (open) {
      setHasNew(false)
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [open])

  const sendMessage = async (text) => {
    const trimmed = text.trim()
    if (!trimmed || typing) return

    const userMsg = { id: msgId++, from: 'user', text: trimmed }
    setMsgs(prev => [...prev, userMsg])
    setInput('')
    setTyping(true)

    try {
      const { reply } = await chatApi.send(trimmed)
      setMsgs(prev => [...prev, { id: msgId++, from: 'bot', text: reply }])
    } catch {
      setMsgs(prev => [...prev, { id: msgId++, from: 'bot', text: '⚠ 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' }])
    } finally {
      setTyping(false)
    }
  }

  const handleKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <>
      {/* ── 채팅 창 ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="fixed bottom-20 right-6 z-50 flex flex-col rounded-xl overflow-hidden shadow-2xl"
            style={{
              width: 'min(360px, calc(100vw - 3rem))',
              height: 'min(520px, calc(100vh - 8rem))',
              border: '1px solid #30363d',
            }}
          >
            {/* 크롬 */}
            <div
              className="flex items-center justify-between px-4 py-2.5 shrink-0"
              style={{ background: '#161b22', borderBottom: '1px solid #21262d' }}
            >
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setOpen(false)}
                    className="w-3 h-3 rounded-full transition-opacity hover:opacity-70"
                    style={{ background: '#ff5f57' }}
                  />
                  <span className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
                  <span className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
                </div>
                <span className="font-mono text-xs select-none" style={{ color: '#6b7280' }}>
                  chisanw-bot — chat
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <motion.span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: '#4ade80' }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                />
                <span className="font-mono text-[10px]" style={{ color: '#4ade80' }}>online</span>
              </div>
            </div>

            {/* 메시지 영역 */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-4"
              style={{ background: '#0d1117' }}
            >
              {msgs.map(msg => <Message key={msg.id} msg={msg} />)}
              {typing && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>

            {/* 추천 질문 (첫 메시지만) */}
            {msgs.length === 1 && !typing && (
              <div
                className="px-4 py-2.5 flex flex-wrap gap-1.5 shrink-0"
                style={{ background: '#0d1117', borderTop: '1px solid #1e2433' }}
              >
                {SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="px-2.5 py-1 rounded-lg font-mono text-[10px] transition-colors"
                    style={{ background: '#1e2433', color: '#818cf8', border: '1px solid #818cf830' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* 입력창 */}
            <div
              className="flex items-center gap-2 px-4 py-3 shrink-0"
              style={{ background: '#161b22', borderTop: '1px solid #21262d' }}
            >
              <span className="font-mono text-xs shrink-0" style={{ color: '#4ade80' }}>›</span>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="메시지를 입력하세요..."
                disabled={typing}
                className="flex-1 bg-transparent outline-none font-mono text-xs placeholder-opacity-40 disabled:opacity-50"
                style={{ color: '#e2e8f0' }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || typing}
                className="px-2.5 py-1 rounded-lg font-mono text-[10px] transition-all disabled:opacity-30"
                style={{ background: '#6366f1', color: '#fff' }}
              >
                send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 플로팅 버튼 ── */}
      <motion.button
        onClick={() => setOpen(v => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
        style={{ background: '#6366f1', boxShadow: '0 0 20px #6366f140' }}
        aria-label="챗봇 열기"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.svg key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }} className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.svg key="chat" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }} transition={{ duration: 0.15 }} className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </motion.svg>
          )}
        </AnimatePresence>

        {/* 미확인 배지 */}
        {hasNew && !open && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
            style={{ background: '#f87171' }}
          >
            1
          </motion.span>
        )}
      </motion.button>
    </>
  )
}
