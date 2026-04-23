// src/app/price/[coin]/[currency]/page.js
// "Bitcoin price in PKR" — 17,000 coins × 12 currencies = 204,000 pages

import { getCoinDetail, getCoinMultiPrice, formatPrice, formatMarketCap, CURRENCIES } from '@/lib/coingecko'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const revalidate = 60

const CURRENCY_MAP = Object.fromEntries(CURRENCIES.map(c => [c.code, c]))

export async function generateStaticParams() {
  // Auto-generated 2026-04-23T22:52:21.305Z — 15000 pages
  const coins = [
    'bitcoin',
    'ethereum',
    'tether',
    'ripple',
    'binancecoin',
    'usd-coin',
    'solana',
    'tron',
    'figure-heloc',
    'dogecoin',
    'whitebit',
    'usds',
    'hyperliquid',
    'leo-token',
    'cardano',
    'bitcoin-cash',
    'monero',
    'chainlink',
    'stellar',
    'zcash',
    'canton-network',
    'memecore',
    'dai',
    'litecoin',
    'usd1-wlfi',
    'avalanche-2',
    'ethena-usde',
    'hedera-hashgraph',
    'sui',
    'shiba-inu',
    'rain',
    'paypal-usd',
    'the-open-network',
    'crypto-com-chain',
    'hashnote-usyc',
    'tether-gold',
    'blackrock-usd-institutional-digital-liquidity-fund',
    'world-liberty-financial',
    'bittensor',
    'global-dollar',
    'pax-gold',
    'mantle',
    'uniswap',
    'polkadot',
    'sky',
    'near',
    'falcon-finance',
    'okb',
    'pi-network',
    'htx-dao',
    'aster-2',
    'pepe',
    'janus-henderson-anemoy-treasury-fund',
    'ripple-usd',
    'aave',
    'usdd',
    'internet-computer',
    'bitget-token',
    'ethereum-classic',
    'ondo-us-dollar-yield',
    'bfusd',
    'ondo-finance',
    'kucoin-shares',
    'gatechain-token',
    'morpho',
    'pump-fun',
    'quant-network',
    'united-stables',
    'eutbl',
    'polygon-ecosystem-token',
    'superstate-short-duration-us-government-securities-fund-ustb',
    'cosmos',
    'ethena',
    'kaspa',
    'render-token',
    'algorand',
    'nexo',
    'worldcoin-wld',
    'arbitrum',
    'aptos',
    'blockchain-capital',
    'filecoin',
    'just',
    'flare-networks',
    'stable-2',
    'official-trump',
    'vechain',
    'beldex',
    'jupiter-exchange-solana',
    'midnight-3',
    'hash-2',
    'ousg',
    'dexe',
    'xdce-crowd-sale',
    'gho',
    'usdtb',
    'bonk',
    'usual-usd',
    'ylds',
    'pudgy-penguins',
    'chiliz',
    'pancakeswap-token',
    'true-usd',
    'edgex',
    'a7a5',
    'fetch-ai',
    'siren-2',
    'dash',
    'virtual-protocol',
    'euro-coin',
    'adi-token',
    'blockstack',
    'first-digital-usd',
    'sei-network',
    'layerzero',
    'janus-henderson-anemoy-aaa-clo-fund',
    'tezos',
    'aerodrome-finance',
    'venice-token',
    'monad',
    'usx',
    'ether-fi',
    'bianrensheng',
    'spx6900',
    'sun-token',
    'kinesis-gold',
    'decred',
    'injective-protocol',
    'hastra-prime',
    'crvusd',
    'curve-dao-token',
    'lido-dao',
    'celestia',
    'floki',
    'bittorrent',
    'gnosis',
    'apenft',
    'bitcoin-cash-sv',
    'conflux-token',
    'zebec-network',
    'pyth-network',
    'doublezero',
    'kinesis-silver',
    'kaia',
    'usdai',
    'kite-2',
    'jasmycoin',
    'terra-luna',
    'frax',
    'ape-and-pepe',
    'syrup',
    'the-graph',
    'olympus',
    'official-fo',
    'optimism',
    'humanity',
    'ravedao',
    'grass',
    'iota',
    'starknet',
    'reallink',
    'plasma',
    'ethereum-name-service',
    'lighter',
    'compound-governance-token',
    'skyai',
    'undeads-games',
    'genius-3',
    'pendle',
    'theta-token',
    'usda-2',
    'agora-dollar',
    'chip-2',
    'ethgas-2',
    'the-sandbox',
    'telcoin',
    'pieverse',
    'tradable-na-rent-financing-platform-sstn',
    'neo',
    'fartcoin',
    'vision-3',
    'apxusd',
    'the9bit',
    'swissborg',
    'btse-token',
    'axie-infinity',
    'helium',
    'story-2',
    'raydium',
    'dogwifcoin',
    'decentraland',
    'chain-2',
    'wefi',
    'trust-wallet-token',
    'nusd-2',
    'falcon-finance-ff',
    'thorchain',
    'spiko-us-t-bills-money-market-fund',
    're-protocol-reusd',
    'sonic-3',
    'walrus-2',
    'tradable-apac-diversified-finance-provider-sstn',
    'mx-token',
    'jito-governance-token',
    'zksync',
    'convex-finance',
    'safepal',
    'satoshi-stablecoin',
    'circle-internet-group-ondo-tokenized-stock',
    'fidelity-digital-interest-token',
    'basic-attention-token',
    'sentient',
    'gala',
    'ribbita-by-virtuals',
    'newton-project',
    'stasis-eurs',
    'gusd',
    'immutable-x',
    'usa',
    'onyc',
    'zano',
    'vaulta',
    'ecash',
    'akash-network',
    'centrifuge-2',
    'instadapp',
    'frax-usd',
    'asteroid-shiba',
    '1inch',
    'theo-short-duration-us-treasury-fund',
    'golem',
    'tradable-latam-fintech-sstn',
    'spark-2',
    'apollo-diversified-credit-securitize-fund',
    'sosovalue',
    'bnb48-club-token',
    'unibase',
    'shuffle-2',
    'arweave',
    'ozone-chain',
    'eigenlayer',
    'origintrail',
    'elrond-erd-2',
    'luxxcoin',
    'gmt-token',
    'avant-usd',
    'zero-gravity',
    'dydx-chain',
    'enjincoin',
    'astherus-usdf',
    'cheems-token',
    'ultima',
    'lido-earn-eth',
    'aethir',
    'tradoor',
    'tokenize-xchange',
    'river',
    'cash-4',
    'societe-generale-forge-eurcv',
    'tradable-singapore-fintech-ssl-2',
    'zencash',
    'cap-usd',
    'safe',
    'tradable-na-third-party-online-merchant-sstn',
    'wemix-token',
    'bitmart-token',
    'reserve-rights-token',
    'melania-meme',
    'gas',
    'quantum-resistant-ledger',
    'tradable-latam-middle-market-lender-sstl',
    'jusd',
    'livepeer',
    'rollbit-coin',
    'securitize-tokenized-aaa-clo-fund',
    'banana-for-scale-2',
    'build-on',
    'qubic-network',
    'usdu',
    'havven',
    'kaito',
    'beam-2',
    'cow-protocol',
    'apecoin',
    'chutes',
    'palm-usd',
    'ini',
    'stp-network',
    'ring-usd',
    'precious-metals-usd',
    'mnee-usd-stablecoin',
    'standx-dusd',
    'tradable-singapore-fintech-ssl',
    'unity-usd',
    'flying-tulip',
    'four',
    'nxm',
    '0x',
    'yearn-finance',
    'berachain-bera',
    'ordinals',
    'lombard-protocol',
    'qtum',
    'grx-chain',
    'ravencoin',
    'seeker',
    'exod',
    'railgun',
    'meteora',
    'block-street',
    'mag7-ssi',
    'kusama',
    'kamino',
    'blur',
    'lovebit',
    'impossible-cloud-network-token',
    'usda-3',
    'everything',
    'xdai',
    'vicicoin',
    'theta-fuel',
    'derive',
    'linea',
    'oasis-network',
    'comedian',
    'keeta',
    'cysic',
    'infinifi-usd',
    'would',
    'get-ai',
    'superfarm',
    'ontology',
    'dog-go-to-the-moon-rune',
    'turbo',
    'zilliqa',
    'nexpace',
    'aioz-network',
    'creditcoin-2',
    'gauntlet-usd-alpha',
    'mina-protocol',
    'bitcastle-token',
    'baby-doge-coin',
    'digibyte',
    'mbg-by-multibank-group',
    'amp-token',
    'holotoken',
    'helio-protocol-hay',
    'deep',
    'arkham',
    'plume',
    'audiera',
    'tradable-na-neobank-sstl',
    'cygnus-finance-global-usd',
    'basedhype',
    'wormhole',
    'toshi',
    'felix-feusd',
    'zetachain',
    'tria',
    'matrixdock-gold',
    'ronin',
    'nervos-network',
    'debridge',
    'dai-on-pulsechain',
    'bc-token',
    'mimblewimblecoin',
    'astar',
    'gamer-tag',
    'coinex-token',
    'gmx',
    'fogo',
    'rosa-inu',
    'temple',
    'tagger',
    'apes-2-2',
    'metal-blockchain',
    'mantra-dao',
    'apyusd',
    'unifai-network',
    'midas-mf-one',
    'fasttoken',
    'threshold-network-token',
    'axelar',
    'targon',
    'based-brett',
    'non-playable-coin',
    'proton',
    'alchemist-ai',
    'usdgo',
    'dusk-network',
    'sahara-ai',
    'vaneck-treasury-fund',
    'movement',
    'dola-usd',
    'irys',
    'loaded-lions',
    'nano',
    'ai-rig-complex',
    'mindwavedao',
    'soon-2',
    'kava',
    'puff-the-dragon',
    'aztec',
    'numeraire',
    'quantixai',
    'tronbank',
    'aelf',
    'ondo-u-s-dollar-token',
    'polymesh',
    'flow',
    'greyhunt',
    'straitsx-xusd',
    'verus-coin',
    'zora',
    'tradable-north-america-pos-lender-sstn',
    'zama',
    'swop-2',
    'opengradient',
    'megausd',
    'rekt-4',
    'usdx',
    'mog-coin',
    'sushi',
    'agentfun-ai',
    'bitkub-coin',
    'home',
    'pythia',
    'babylon',
    'eurite',
    'chainopera-ai',
    'popcat',
    'moo-deng',
    'hashkey-ecopoints',
    'jupusd',
    'unit-pump',
    'vethor-token',
    'request-network',
    'concordium',
    'bitdca',
    'orca',
    'tdccp',
    'strategy-pp-variable-xstock',
    'verge',
    'main-street-usd',
    'vvs-finance',
    'bio-protocol',
    'meta-2-2',
    'world-mobile-token',
    'velo',
    'mocaverse',
    'cat-in-a-dogs-world',
    'lab',
    'peanut-the-squirrel',
    'escoin-token',
    'celium',
    'wiki-cat',
    'affine',
    'tradable-na-legal-receivables-ssl',
    'magic-eden',
    'geodnet',
    'brz',
    'celo',
    'pay-coin',
    'yooldo-games',
    'tesla-xstock',
    'coredaoorg',
    'main-street-yield',
    'mask-network',
    'dual',
    'tellor',
    'ankr',
    'mantra',
    'usdkg',
    'alloy-tether',
    'playsout',
    'deso',
    'law-blocks',
    'fidelity-digital-dollar',
    'tradable-eu-latam-pos-financing-sstl',
    'redstone-oracles',
    'mimbogamegroup',
    'openledger-2',
    'xyo-network',
    'palladium-network',
    'fractal-bitcoin',
    'succinct',
    'circle-xstock',
    'midas-mtbill',
    'aleo',
    'sygnum-fiusd-liquidity-fund',
    'chia',
    'siacoin',
    'huma-finance',
    'merlin-chain',
    'sierra-2',
    'altlayer',
    'casper-network',
    'robo-token-2',
    'bas',
    'avantis'
  ]
  const currencies = [
    'pkr',
    'inr',
    'aed',
    'sar',
    'gbp',
    'eur',
    'try',
    'brl',
    'jpy',
    'cad',
    'aud',
    'myr',
    'usd',
    'sgd',
    'hkd',
    'chf',
    'sek',
    'nok',
    'dkk',
    'thb',
    'krw',
    'idr',
    'php',
    'bdt',
    'vnd',
    'ngn',
    'kes',
    'zar',
    'egp',
    'ars'
  ]
  const params = []
  for (const coin of coins) {
    for (const currency of currencies) {
      params.push({ coin, currency })
    }
  }
  return params
}

export async function generateMetadata({ params }) {
  const cur = CURRENCY_MAP[params.currency]
  if (!cur) return { title: 'Not Found' }
  const coin = await getCoinDetail(params.coin)
  if (!coin) return { title: 'Not Found' }
  const multiPrice = await getCoinMultiPrice(params.coin)
  const price = multiPrice?.[params.coin]?.[params.currency]
  return {
    title: `${coin.name} Price in ${cur.name} (${cur.code.toUpperCase()}) Today — Live ${coin.symbol?.toUpperCase()}/${cur.code.toUpperCase()} Rate`,
    description: `${coin.name} price today in ${cur.name} is ${cur.symbol}${price?.toLocaleString('en-US', { maximumFractionDigits: 2 }) || 'N/A'}. Track live ${coin.name} to ${cur.code.toUpperCase()} conversion rate, charts, and market data.`,
  }
}

export default async function PriceCurrencyPage({ params }) {
  const cur = CURRENCY_MAP[params.currency]
  if (!cur) return notFound()

  const [coin, multiPrice] = await Promise.all([
    getCoinDetail(params.coin),
    getCoinMultiPrice(params.coin)
  ])
  if (!coin || coin.error) return notFound()

  const prices = multiPrice?.[params.coin] || {}
  const priceInCur = prices[params.currency]
  const priceUSD = prices.usd || coin.market_data?.current_price?.usd
  const md = coin.market_data
  const chg24 = md?.price_change_percentage_24h

  // FAQ Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is ${coin.name} price in ${cur.name} today?`,
        acceptedAnswer: { '@type': 'Answer', text: `The current ${coin.name} price in ${cur.name} is ${cur.symbol}${priceInCur?.toLocaleString('en-US', { maximumFractionDigits: 2 })} ${cur.code.toUpperCase()}. The price has changed ${chg24?.toFixed(2)}% in the last 24 hours.` }
      },
      {
        '@type': 'Question',
        name: `How much is 1 ${coin.name} in ${cur.code.toUpperCase()}?`,
        acceptedAnswer: { '@type': 'Answer', text: `1 ${coin.name} (${coin.symbol?.toUpperCase()}) = ${cur.symbol}${priceInCur?.toLocaleString('en-US', { maximumFractionDigits: 2 })} ${cur.code.toUpperCase()} at today's rate.` }
      },
      {
        '@type': 'Question',
        name: `How to convert ${coin.name} to ${cur.name}?`,
        acceptedAnswer: { '@type': 'Answer', text: `To convert ${coin.name} to ${cur.name}, multiply the amount of ${coin.name} by the current rate (${cur.symbol}${priceInCur?.toLocaleString('en-US', { maximumFractionDigits: 2 })}). For example, 0.1 ${coin.symbol?.toUpperCase()} = ${cur.symbol}${(priceInCur * 0.1)?.toLocaleString('en-US', { maximumFractionDigits: 2 })} ${cur.code.toUpperCase()}.` }
      },
    ]
  }

  // Conversion table amounts
  const amounts = [0.001, 0.01, 0.1, 0.5, 1, 5, 10, 50, 100]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="breadcrumb">
        <a href="/">Home</a> › <a href={`/coins/${params.coin}`}>{coin.name}</a> › <span>Price in {cur.name}</span>
      </div>

      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '28px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <img src={coin.image?.large} alt={coin.name} width={48} height={48} style={{ borderRadius: '50%' }} />
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 700 }}>
                {coin.name} ({coin.symbol?.toUpperCase()}) Price in {cur.flag} {cur.name} ({cur.code.toUpperCase()})
              </h1>
              <p style={{ color: 'var(--text2)', fontSize: '13px', marginTop: '4px' }}>Live rate · Updates every 60 seconds</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px 20px', minWidth: '200px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.7px' }}>1 {coin.symbol?.toUpperCase()} =</div>
              <div style={{ fontSize: '30px', fontWeight: 700, fontFamily: 'var(--mono)', marginTop: '6px', color: 'var(--gold)' }}>
                {cur.symbol}{priceInCur?.toLocaleString('en-US', { maximumFractionDigits: 2 }) || 'N/A'}
              </div>
              <div style={{ fontSize: '12px', color: chg24 >= 0 ? 'var(--green)' : 'var(--red)', marginTop: '4px' }}>
                {chg24 >= 0 ? '▲' : '▼'} {Math.abs(chg24)?.toFixed(2)}% (24h)
              </div>
            </div>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px 20px', minWidth: '200px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.7px' }}>USD Price</div>
              <div style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'var(--mono)', marginTop: '6px' }}>{formatPrice(priceUSD)}</div>
              <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '4px' }}>Market Cap: {formatMarketCap(md?.market_cap?.usd)}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '28px 24px' }}>
        {/* CONVERSION TABLE */}
        <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '17px', marginBottom: '16px' }}>{coin.name} to {cur.name} Conversion Table</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg3)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '12px', color: 'var(--text3)', fontWeight: 600 }}>{coin.symbol?.toUpperCase()} Amount</th>
                <th style={{ padding: '10px 16px', textAlign: 'right', fontSize: '12px', color: 'var(--text3)', fontWeight: 600 }}>{cur.code.toUpperCase()} Value</th>
                <th style={{ padding: '10px 16px', textAlign: 'right', fontSize: '12px', color: 'var(--text3)', fontWeight: 600 }}>USD Value</th>
              </tr>
            </thead>
            <tbody>
              {amounts.map(amt => (
                <tr key={amt} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '11px 16px', fontFamily: 'var(--mono)', fontWeight: 500 }}>{amt} {coin.symbol?.toUpperCase()}</td>
                  <td style={{ padding: '11px 16px', textAlign: 'right', fontFamily: 'var(--mono)', color: 'var(--gold)' }}>{cur.symbol}{(priceInCur * amt)?.toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
                  <td style={{ padding: '11px 16px', textAlign: 'right', fontFamily: 'var(--mono)', color: 'var(--text2)' }}>${(priceUSD * amt)?.toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FAQ */}
        <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '17px', marginBottom: '16px' }}>FAQs: {coin.name} Price in {cur.name}</h2>
          <div className="faq">
            {faqSchema.mainEntity.map((faq, i) => (
              <div key={i} className="faq-item">
                <div className="faq-q">{faq.name}</div>
                <div className="faq-a">{faq.acceptedAnswer.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* OTHER CURRENCIES */}
        <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', marginBottom: '14px' }}>{coin.name} Price in Other Currencies</h2>
          <div className="currency-grid">
            {CURRENCIES.filter(c => c.code !== params.currency).map(c => {
              const p = prices[c.code]
              return (
                <Link key={c.code} href={`/price/${params.coin}/${c.code}`} className="currency-card" style={{ textDecoration: 'none', display: 'block' }}>
                  <div className="flag">{c.flag}</div>
                  <div className="cur-name">{c.name}</div>
                  <div className="cur-price">{p ? c.symbol + p.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '—'}</div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Link href={`/buy/${params.coin}/pakistan`} style={{ background: 'var(--green)', color: '#000', padding: '14px 32px', borderRadius: '10px', fontWeight: 700, fontSize: '15px', display: 'inline-block' }}>
            Buy {coin.name} Now →
          </Link>
        </div>
      </div>
    </>
  )
}
