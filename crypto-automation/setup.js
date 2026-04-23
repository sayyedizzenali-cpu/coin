#!/usr/bin/env node
// setup.js — First time setup
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const c = {
  green:  (t) => `\x1b[32m${t}\x1b[0m`,
  red:    (t) => `\x1b[31m${t}\x1b[0m`,
  yellow: (t) => `\x1b[33m${t}\x1b[0m`,
  blue:   (t) => `\x1b[34m${t}\x1b[0m`,
  bold:   (t) => `\x1b[1m${t}\x1b[0m`,
}

console.log(c.bold(c.blue('\n🦎 CryptoWorld Automation Setup\n')))

// Check if we're in the right directory
if (!fs.existsSync('./src/app')) {
  console.log(c.red('❌ Error: Run this from your cryptoworld project root!'))
  console.log(c.yellow('   cd C:\\Users\\Izzan\\...\\cryptoworld'))
  console.log(c.yellow('   node automation/setup.js\n'))
  process.exit(1)
}

// Copy automation scripts to project
const automationDir = path.join(process.cwd(), 'automation')
if (!fs.existsSync(automationDir)) {
  fs.mkdirSync(automationDir, { recursive: true })
}

// Copy scripts
const scriptsDir = __dirname
;['generate.js', 'glossary-gen.js'].forEach(file => {
  const src = path.join(scriptsDir, file)
  const dest = path.join(automationDir, file)
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest)
    console.log(c.green(`✓ Copied ${file} to automation/`))
  }
})

// Create .cache directory
fs.mkdirSync('.cache', { recursive: true })
console.log(c.green('✓ Created .cache directory'))

// Add to .gitignore
let gitignore = fs.existsSync('.gitignore') ? fs.readFileSync('.gitignore', 'utf8') : ''
if (!gitignore.includes('.cache/')) {
  gitignore += '\n# Automation cache\n.cache/\n'
  fs.writeFileSync('.gitignore', gitignore)
  console.log(c.green('✓ Updated .gitignore'))
}

// Create package.json scripts
const pkgPath = './package.json'
if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
  pkg.scripts = {
    ...pkg.scripts,
    'generate': 'node automation/generate.js',
    'generate:all': 'node automation/generate.js all',
    'generate:coins': 'node automation/generate.js coins',
    'generate:buy': 'node automation/generate.js buy',
    'generate:price': 'node automation/generate.js price',
    'generate:prediction': 'node automation/generate.js prediction',
    'generate:compare': 'node automation/generate.js compare',
    'generate:glossary': 'node automation/glossary-gen.js',
    'generate:sitemap': 'node automation/generate.js sitemap',
    'generate:status': 'node automation/generate.js status',
    'deploy': 'node automation/generate.js deploy',
    'deploy:msg': 'node automation/generate.js deploy',
  }
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
  console.log(c.green('✓ Added npm scripts to package.json'))
}

console.log(c.bold(c.green('\n✅ Setup complete!\n')))
console.log(c.bold('Available commands:'))
console.log(c.blue('  npm run generate:status') + '    → Check site status')
console.log(c.blue('  npm run generate:all') + '       → Generate all pages')
console.log(c.blue('  npm run generate:coins') + '     → Update coin pages')
console.log(c.blue('  npm run generate:buy') + '       → Update buy pages')
console.log(c.blue('  npm run generate:price') + '     → Update price pages')
console.log(c.blue('  npm run generate:glossary') + '  → Generate 500+ glossary terms')
console.log(c.blue('  npm run deploy') + '             → Push to GitHub + auto-deploy\n')
console.log(c.yellow('For glossary generation, set API key:'))
console.log(c.yellow('  $env:ANTHROPIC_API_KEY="sk-ant-..."\n'))
