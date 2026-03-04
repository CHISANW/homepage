import { motion } from 'framer-motion'
import { FaGithub, FaEnvelope, FaBlog } from 'react-icons/fa'

const LINKS = [
  { icon: FaGithub,  href: 'https://github.com/CHISANW',          label: 'GitHub',  color: '#e2e8f0' },
  { icon: FaEnvelope, href: 'mailto:keuye06380618@gmail.com',      label: 'Email',   color: '#f87171' },
  { icon: FaBlog,    href: 'https://back-stead.tistory.com',       label: 'Blog',    color: '#fbbf24' },
]

export default function Footer() {
  return (
    <footer style={{ background: '#080d1a', borderTop: '1px solid #1e2433' }}>
      <div className="section-container py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">

          {/* 왼쪽: exit 메시지 */}
          <div className="font-mono text-xs" style={{ color: '#555' }}>
            <span style={{ color: '#4ade80' }}>chisanw</span>
            <span>@dev:~$ </span>
            <span style={{ color: '#e2e8f0' }}>exit</span>
            <br />
            <span style={{ color: '#30363d' }}>[Process exited with code 0]</span>
          </div>

          {/* 가운데: 아이콘 링크 */}
          <div className="flex items-center gap-4">
            {LINKS.map(({ icon: Icon, href, label, color }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                aria-label={label}
                className="transition-opacity hover:opacity-70"
                style={{ color }}
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>

          {/* 오른쪽: 저작권 */}
          <p className="font-mono text-[11px]" style={{ color: '#30363d' }}>
            © {new Date().getFullYear()} 김민우 (CHISANW)
          </p>

        </div>
      </div>
    </footer>
  )
}
