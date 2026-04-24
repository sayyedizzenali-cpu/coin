// src/app/layout.js — V5 with SearchBar
import './globals.css'
import SearchBar from '@/components/SearchBar'

export const metadata = {
  title: { default: 'CryptoWorld — Live Cryptocurrency Prices', template: '%s | CryptoWorld' },
  description: 'Live cryptocurrency prices, charts, and market data for 17,000+ coins in 150+ currencies worldwide.',
  keywords: ['cryptocurrency', 'bitcoin price', 'crypto prices', 'live crypto', 'coin market cap'],
  openGraph: { type: 'website', siteName: 'CryptoWorld' },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="navbar">
          <div className="nav-inner">
            <a href="/" className="logo">
              <span className="logo-icon">🦎</span>
              <span>Crypto<strong>World</strong></span>
            </a>
            <SearchBar />
            <div className="nav-links">
              <a href="/">Prices</a>
              <a href="/trending">Trending</a>
              <a href="/glossary">Glossary</a>
              <a href="/about">About</a>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="footer">
          <div className="footer-inner">
            <p>Data powered by <a href="https://coingecko.com" target="_blank" rel="noopener">CoinGecko API</a> &nbsp;|&nbsp; News by <a href="https://cryptopanic.com" target="_blank" rel="noopener">CryptoPanic</a> &nbsp;|&nbsp; <strong>CryptoWorld</strong> &copy; 2026</p>
            <p style={{marginTop:'6px',opacity:0.6}}>Not financial advice. Cryptocurrency investments carry high risk. Always do your own research.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
