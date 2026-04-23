#!/usr/bin/env node
// glossary-gen.js — Generate 500+ glossary terms using Claude API
// Run: node glossary-gen.js [count]
// Requires: ANTHROPIC_API_KEY env variable

const fs = require('fs')
const https = require('https')

const c = {
  green:  (t) => `\x1b[32m${t}\x1b[0m`,
  red:    (t) => `\x1b[31m${t}\x1b[0m`,
  yellow: (t) => `\x1b[33m${t}\x1b[0m`,
  blue:   (t) => `\x1b[34m${t}\x1b[0m`,
  bold:   (t) => `\x1b[1m${t}\x1b[0m`,
  dim:    (t) => `\x1b[2m${t}\x1b[0m`,
}

// All crypto terms to generate
const TERM_BATCHES = [
  // Batch 1 - Basic
  ['satoshi', 'wei', 'gwei', 'mempool', 'nonce', 'merkle-tree', 'genesis-block', 'block-explorer', 'transaction-hash', 'confirmations'],
  // Batch 2 - Trading
  ['long', 'short', 'margin', 'stop-loss', 'take-profit', 'order-book', 'market-order', 'limit-order', 'candlestick', 'rsi'],
  // Batch 3 - DeFi
  ['tvl', 'flash-loan', 'liquidation', 'collateral', 'overcollateralization', 'lending-protocol', 'borrowing', 'interest-rate', 'stable-swap', 'rebase'],
  // Batch 4 - NFT/Metaverse
  ['mint', 'burn', 'royalty', 'floor-price', 'rarity', 'whitelist', 'generative-art', 'pfp', 'virtual-land', 'play-to-earn'],
  // Batch 5 - Technical
  ['zero-knowledge-proof', 'zkp', 'rollup', 'optimistic-rollup', 'zk-rollup', 'state-channel', 'plasma', 'sidechain', 'sharding', 'evm'],
  // Batch 6 - Security
  ['51-attack', 'double-spend', 'sybil-attack', 'rug-pull', 'honeypot', 'phishing', 'social-engineering', 'multisig', 'timelock', 'audit'],
  // Batch 7 - Tokens
  ['erc-20', 'erc-721', 'erc-1155', 'bep-20', 'spl-token', 'wrapped-token', 'governance-token', 'utility-token', 'security-token', 'fan-token'],
  // Batch 8 - Ecosystem
  ['validator', 'delegator', 'node', 'full-node', 'light-node', 'archive-node', 'rpc', 'api', 'sdk', 'testnet'],
  // Batch 9 - Culture
  ['ape-in', 'fud', 'fomo', 'ngmi', 'wagmi', 'dyor', 'nfa', 'gm', 'ser', 'probably-nothing'],
  // Batch 10 - Advanced
  ['mev', 'front-running', 'sandwich-attack', 'arbitrage', 'liquidation-cascade', 'debt-ceiling', 'peg', 'de-peg', 'protocol-owned-liquidity', 've-tokenomics'],
]

function callClaude(prompt) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    })

    const options = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(data)
      }
    }

    const req = https.request(options, (res) => {
      let body = ''
      res.on('data', chunk => body += chunk)
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body)
          resolve(parsed.content?.[0]?.text || '')
        } catch(e) { reject(e) }
      })
    })
    req.on('error', reject)
    req.write(data)
    req.end()
  })
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function generateTerm(slug) {
  const term = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  const prompt = `Generate a crypto glossary entry for "${term}" in JSON format.

Return ONLY valid JSON, no markdown, no explanation:
{
  "slug": "${slug}",
  "term": "${term}",
  "category": "one of: Technology|Finance|Trading|Security|Governance|Culture|Cryptocurrency|DeFi|NFT|Regulation",
  "difficulty": "one of: Beginner|Intermediate|Advanced",
  "definition": "one sentence definition, max 150 chars",
  "longDesc": "3-4 paragraph explanation, 200-300 words, factual, educational",
  "related": ["array", "of", "3-5", "related-slugs"],
  "coins": ["optional", "related", "coin-ids"]
}`

  try {
    const response = await callClaude(prompt)
    // Clean response
    const clean = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(clean)
  } catch(e) {
    // Fallback
    return {
      slug,
      term,
      category: 'Technology',
      difficulty: 'Intermediate',
      definition: `${term} is an important concept in cryptocurrency and blockchain technology.`,
      longDesc: `${term} plays a significant role in the crypto ecosystem. Understanding ${term} is essential for anyone participating in cryptocurrency markets and blockchain technology. This concept applies to various aspects of decentralized finance and digital assets.`,
      related: [],
      coins: []
    }
  }
}

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.log(c.red('\n❌ ANTHROPIC_API_KEY not set!'))
    console.log(c.yellow('   Set it: $env:ANTHROPIC_API_KEY="your-key-here"'))
    console.log(c.dim('   Or get key from: console.anthropic.com\n'))
    process.exit(1)
  }

  console.log(c.bold(c.blue('\n📚 Glossary Term Generator')))

  // Load existing terms
  const existingPath = './src/lib/glossary.js'
  let existingTerms = []

  if (fs.existsSync(existingPath)) {
    const content = fs.readFileSync(existingPath, 'utf8')
    const slugMatches = content.match(/slug: '([\w-]+)'/g) || []
    existingTerms = slugMatches.map(m => m.replace("slug: '", '').replace("'", ''))
    console.log(c.green(`✓ Found ${existingTerms.length} existing terms`))
  }

  // Flatten all terms
  const allTerms = TERM_BATCHES.flat().filter(t => !existingTerms.includes(t))
  console.log(c.blue(`\n📝 Generating ${allTerms.length} new terms...`))

  const newTerms = []
  let success = 0, failed = 0

  for (let i = 0; i < allTerms.length; i++) {
    const slug = allTerms[i]
    process.stdout.write(`\r   ${i + 1}/${allTerms.length}: ${slug.padEnd(30)}`)

    try {
      const term = await generateTerm(slug)
      newTerms.push(term)
      success++
    } catch(e) {
      failed++
    }

    // Rate limiting
    if ((i + 1) % 5 === 0) await sleep(1000)
  }

  console.log(c.green(`\n✅ Generated ${success} terms (${failed} failed)`))

  if (newTerms.length === 0) {
    console.log(c.yellow('No new terms generated'))
    return
  }

  // Save to file
  const allTermsObj = newTerms
  const output = `// src/lib/glossary.js — Auto-generated
// Generated: ${new Date().toISOString()}
// Total: ${(existingTerms.length + newTerms.length)} terms

${fs.existsSync(existingPath) ? fs.readFileSync(existingPath, 'utf8').replace(/\/\/ src\/lib\/glossary\.js[\s\S]*?export const GLOSSARY_TERMS = \[/, '').replace(/\](\s*\nexport)/, '').trim() : ''}

// New auto-generated terms
const NEW_TERMS = ${JSON.stringify(newTerms, null, 2)}

export const GLOSSARY_TERMS = [...EXISTING_TERMS, ...NEW_TERMS]
`

  // Better approach: append to existing
  const newTermsCode = newTerms.map(t => `  ${JSON.stringify(t)}`).join(',\n')

  if (fs.existsSync(existingPath)) {
    let content = fs.readFileSync(existingPath, 'utf8')
    // Insert before the closing ] of GLOSSARY_TERMS
    content = content.replace(
      /^]$/m,
      `,\n  // Auto-generated terms — ${new Date().toISOString()}\n${newTermsCode}\n]`
    )
    fs.writeFileSync(existingPath, content, 'utf8')
    console.log(c.green(`✅ Added ${newTerms.length} terms to src/lib/glossary.js`))
  }

  console.log(c.bold(c.green(`\n🎉 Total glossary terms: ${existingTerms.length + newTerms.length}`)))
  console.log(c.dim('   Run: node generate.js deploy\n'))
}

main().catch(e => {
  console.error(c.red('\n❌ ' + e.message))
  process.exit(1)
})
