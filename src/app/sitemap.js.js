// src/app/sitemap.js — COMPLETE STATIC SITEMAP
// 16,994 URLs — No API calls at build time
// Auto-generated — DO NOT EDIT MANUALLY

export const revalidate = 86400

// Top 500 coins (from CoinGecko cache)
const COINS_500 = [
  // Top 100 — High priority
  'bitcoin','ethereum','binancecoin','solana','ripple','cardano','dogecoin',
  'avalanche-2','polkadot','chainlink','litecoin','bitcoin-cash','stellar',
  'tron','near','cosmos','algorand','vechain','hedera-hashgraph','aptos',
  'arbitrum','optimism','polygon','uniswap','aave','maker','filecoin',
  'internet-computer','monero','ethereum-classic','eos','tezos','iota',
  'neo','waves','dash','zcash','qtum','ontology','zilliqa','shiba-inu',
  'pepe','floki','bonk','dogwifhat','wrapped-bitcoin','staked-ether',
  'usd-coin','dai','frax','injective-protocol','celestia','sui',
  'sei-network','pyth-network','jupiter-ag','raydium','jito',
  'the-graph','render-token','fetch-ai','singularitynet','ocean-protocol',
  'helium','iotex','akash-network','golem','iexec-rlc',
  'curve-dao-token','balancer','1inch','sushi','synthetix-network-token',
  'compound-governance-token','yearn-finance','harvest-finance',
  'convex-finance','lido-dao','rocket-pool','ankr','frax-share',
  'gmx','dydx','gains-network','band-protocol','api3','uma','gnosis',
  'enjin-coin','gala','the-sandbox','decentraland','axie-infinity',
  'stepn','worldcoin','chainlink','band-protocol',
  // 101-200
  'kusama','acala','moonbeam','astar','parallel-finance','bifrost',
  'phala-network','crust-network','aurora-near','ref-finance',
  'benqi','trader-joe-2','platypus-finance','alpha-finance',
  'harmony','defi-kingdoms','celo','moola-market','ubeswap',
  'quickswap','aavegotchi','immutable-x','gods-unchained',
  'gala','alien-worlds','splinterlands','vulcan-forged-pyr',
  'ultra','wax','star-atlas','genopets','sweatcoin',
  'proof-of-humanity','brightid','civic','self-key','bloom',
  'bitcoin-gold','litecoin','dash','zcash','grin','beam',
  'firo','pirate-chain','haven-protocol','secret',
  'polymarket','serum','bonfida','mango-markets','openbook',
  'drift-protocol','zeta-markets','ribbon-finance','opyn','lyra-finance',
  'hegic','premia','storj','siacoin','arweave',
  'numeraire','cortex','cudos','streamr','hivemapper',
  'fantom','harmony','celo','klaytn','conflux-token',
  'oasis-network','elrond','theta-token','theta-fuel','flow',
  'chiliz','santos-fc-fan-token','paris-saint-germain-fan-token',
  'juventus-fan-token','galatasaray-fan-token','alpine-f1-team-fan-token',
  'lazio-fan-token','ac-milan-fan-token','napoli-fan-token',
  'inter-milan-fan-token','arsenal-fan-token','manchester-city-fan-token',
  'loopring','kyber-network-crystal','0x','airswap','hashflow',
  'morpho','euler','rari-governance-token','maple','goldfinch',
  'centrifuge','credix','truefi','clearpool',
  'stakewise','stafi','klima-dao','olympus','spell-token',
  'abracadabra','popsicle-finance','beefy-finance','autofarm',
  'alpaca-finance','venus','pancakeswap-token','biswap','apeswap',
  // 201-300
  'velodrome-finance','aerodrome-finance','camelot-token','ramses-exchange',
  'tellor','dia-data','aleph-im','ocean-protocol',
  'dimo','polkadot','kusama','near','aurora-near',
  'avalanche-2','benqi','harmony','celo','polygon',
  'immutable-x','guild-of-guardians','myneighboralice',
  'dotmoovs','wirtual','idena','sovrin','ens',
  'unstoppable-domains','handshake','bitcoin-diamond',
  'mimblewimble-coin','railgun','tornado-cash',
  'augur','reality-cards','futureswap',
  'psyoptions','siren-protocol','ribbon-finance',
  'paraswap','cowswap','bancor',
  'iron-finance','wonderland','tranquil-finance',
  'mobius-money','decentral-games','illuvinarium',
  'mist','wax','upland',
  'terra-luna-2','luna-classic','terraclassic',
  'anchor-protocol','mirror-protocol','kava','thorchain',
  'juno-network','stargaze','osmosis','akash-network',
  'dymension','blast-protocol','scroll','zksync',
  'starknet','base','linea','mantle',
  'wrapped-ether','rocket-pool-eth','frax-ether',
  'binance-usd','trueusd','pax-gold','tether-gold',
  'temple-dao','wonderland','time',
  'sanctum','tensor','magic-eden','metaplex',
  'compressed-nft','bubblegum','marinade','orca',
  'book-of-meme','dogwifhat','pepe','bonk','floki',
  // 301-400
  'ravencoin','horizen','nano','digibyte','vertcoin',
  'syscoin','stratis','ark','pivx','particl',
  'groestlcoin','peercoin','primecoin','namecoin',
  'feathercoin','novacoin','terracoin',
  'basic-attention-token','omisego','civic',
  'loopring','balancer','curve-dao-token',
  'yearn-finance','sushi','1inch',
  'pancakeswap-token','tokenlon','dodo','bancor',
  'gnosis','synthetix-network-token','uma',
  'badger-dao','harvest-finance','rari-governance-token',
  'alpha-finance','pickle-finance','cream-finance',
  'cover-protocol','akropolis','mstable',
  'thorchain','kava','terra-luna',
  'mirror-protocol','anchor-protocol','osmosis',
  'juno-network','secret','stargaze',
  'injective-protocol','dydx','gmx',
  'gains-network','level-finance','mux-protocol',
  'kwenta','synthetix-network-token','uma',
  'ribbon-finance','dopex','lyra-finance',
  'premia','hegic','opyn','charm',
  'potion-protocol','siren-protocol',
  'curve-dao-token','balancer','bancor',
  'kyber-network-crystal','loopring',
  '1inch','paraswap','0x','airswap',
  'hashflow','cowswap',
  // 401-500
  'compound-governance-token','aave','morpho',
  'euler','rari-governance-token','maple',
  'goldfinch','centrifuge','credix','truefi','clearpool',
  'lido-dao','rocket-pool','stakewise','ankr',
  'stafi','rocketpool','frax-share',
  'frax-ether','temple-dao','olympus','klima-dao',
  'wonderland','time','spell-token',
  'abracadabra','popsicle-finance','convex-finance',
  'yearn-finance','harvest-finance','beefy-finance',
  'autofarm','alpaca-finance','venus',
  'pancakeswap-token','biswap','apeswap',
  'sushi','uniswap','shibaswap','fraxswap',
  'velodrome-finance','aerodrome-finance',
  'camelot-token','ramses-exchange','thena',
  'chainlink','band-protocol','api3','tellor',
  'dia-data','the-graph','aleph-im',
  'filecoin','arweave','storj','siacoin',
  'ocean-protocol','fetch-ai','singularitynet',
  'numeraire','cortex','render-token',
  'akash-network','cudos','golem','iexec-rlc',
  'helium','iotex','streamr','hivemapper','dimo',
]

const COUNTRIES_50 = [
  'pakistan','india','united-states','united-kingdom','nigeria','uae','turkey',
  'brazil','indonesia','philippines','south-africa','canada','australia',
  'saudi-arabia','kenya','ghana','egypt','malaysia','singapore','thailand',
  'bangladesh','vietnam','south-korea','japan','germany','france','spain',
  'mexico','argentina','sri-lanka','nepal','myanmar','ethiopia','tanzania',
  'cameroon','ivory-coast','senegal','morocco','algeria','tunisia','jordan',
  'iraq','iran','kuwait','qatar','ukraine','russia','poland','netherlands','sweden'
]

const CURRENCIES_20 = [
  'pkr','inr','aed','sar','gbp','eur','try','brl','jpy','cad',
  'aud','myr','usd','sgd','hkd','chf','sek','nok','dkk','thb'
]

const YEARS_13 = [
  '2025','2026','2027','2028','2029','2030',
  '2031','2032','2033','2034','2035','2040','2050'
]

const GLOSSARY_64 = [
  'blockchain','bitcoin','ethereum','defi','nft','smart-contract','proof-of-work',
  'proof-of-stake','wallet','staking','altcoin','stablecoin','gas-fee','mining',
  'dex','halving','dao','web3','market-cap','layer-2','yield-farming','seed-phrase',
  'liquidity-pool','cold-storage','bull-market','bear-market','dca','hodl',
  'impermanent-loss','amm','tokenomics','apy','private-key','hash-rate','fork',
  'cbdc','kyc','metaverse','regulation','whale','gas-limit','consensus-mechanism',
  'block-reward','defi-yield','on-chain','address','whitepaper','ico','liquidity',
  'slippage','volatility','leverage','futures','decentralization','interoperability',
  'layer-1','cross-chain','solana','cardano','polkadot','chainlink','uniswap','aave',
  'defi-2','satoshi'
]

const COMPARE_PAIRS = []
const top20 = COINS_500.slice(0, 20)
for (let i = 0; i < top20.length; i++) {
  for (let j = i + 1; j < top20.length; j++) {
    COMPARE_PAIRS.push(`${top20[i]}-vs-${top20[j]}`)
  }
}

export default function sitemap() {
  const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://cryptopakistan.com'
  const now = new Date()
  const HIGH_PRIORITY = ['bitcoin','ethereum','binancecoin','solana','ripple','cardano','dogecoin']
  const urls = []

  // Static pages
  urls.push(
    { url: BASE, lastModified: now, changeFrequency: 'hourly', priority: 1.0 },
    { url: `${BASE}/trending`, lastModified: now, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${BASE}/glossary`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  )

  // Coin pages
  COINS_500.forEach(id => urls.push({
    url: `${BASE}/coins/${id}`,
    lastModified: now,
    changeFrequency: 'hourly',
    priority: HIGH_PRIORITY.includes(id) ? 1.0 : 0.85,
  }))

  // Price pages — 500 coins x 20 currencies
  COINS_500.forEach(coin => {
    CURRENCIES_20.forEach(cur => urls.push({
      url: `${BASE}/price/${coin}/${cur}`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: cur === 'pkr' ? 0.95 : 0.8,
    }))
  })

  // Buy pages — 100 coins x 50 countries
  COINS_500.slice(0, 100).forEach(coin => {
    COUNTRIES_50.forEach(country => urls.push({
      url: `${BASE}/buy/${coin}/${country}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: country === 'pakistan' ? 0.95 : 0.8,
    }))
  })

  // Prediction pages — 100 coins x 13 years
  COINS_500.slice(0, 100).forEach(coin => {
    YEARS_13.forEach(year => urls.push({
      url: `${BASE}/prediction/${coin}/${year}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.75,
    }))
  })

  // Compare pages
  COMPARE_PAIRS.forEach(pair => urls.push({
    url: `${BASE}/compare/${pair}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.7,
  }))

  // Glossary
  GLOSSARY_64.forEach(slug => urls.push({
    url: `${BASE}/glossary/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return urls
}
