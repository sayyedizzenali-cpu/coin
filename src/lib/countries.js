// src/lib/countries.js
// 50 countries with local context for "How to Buy" pages

export const COUNTRIES = [
  { slug: 'pakistan', name: 'Pakistan', currency: 'PKR', symbol: '₨', flag: '🇵🇰', exchanges: ['Binance', 'KuCoin', 'OKX'], paymentMethods: ['Bank Transfer', 'JazzCash', 'EasyPaisa', 'Credit Card'], language: 'Urdu/English', region: 'Asia' },
  { slug: 'india', name: 'India', currency: 'INR', symbol: '₹', flag: '🇮🇳', exchanges: ['WazirX', 'CoinDCX', 'Binance', 'Coinbase'], paymentMethods: ['UPI', 'IMPS', 'Bank Transfer', 'Credit Card'], language: 'Hindi/English', region: 'Asia' },
  { slug: 'united-states', name: 'United States', currency: 'USD', symbol: '$', flag: '🇺🇸', exchanges: ['Coinbase', 'Kraken', 'Binance US', 'Gemini'], paymentMethods: ['Bank Transfer (ACH)', 'Wire Transfer', 'Credit Card', 'PayPal'], language: 'English', region: 'North America' },
  { slug: 'united-kingdom', name: 'United Kingdom', currency: 'GBP', symbol: '£', flag: '🇬🇧', exchanges: ['Coinbase', 'Kraken', 'Binance', 'Revolut'], paymentMethods: ['Bank Transfer', 'Faster Payments', 'Debit Card'], language: 'English', region: 'Europe' },
  { slug: 'nigeria', name: 'Nigeria', currency: 'NGN', symbol: '₦', flag: '🇳🇬', exchanges: ['Binance', 'KuCoin', 'Bybit', 'Patricia'], paymentMethods: ['Bank Transfer', 'Opay', 'Flutterwave'], language: 'English', region: 'Africa' },
  { slug: 'turkey', name: 'Turkey', currency: 'TRY', symbol: '₺', flag: '🇹🇷', exchanges: ['Binance', 'Paribu', 'BtcTurk', 'OKX'], paymentMethods: ['Bank Transfer', 'Credit Card', 'Papara'], language: 'Turkish', region: 'Europe/Asia' },
  { slug: 'brazil', name: 'Brazil', currency: 'BRL', symbol: 'R$', flag: '🇧🇷', exchanges: ['Binance', 'Mercado Bitcoin', 'Coinbase', 'NovaDAX'], paymentMethods: ['PIX', 'Bank Transfer', 'Boleto', 'Credit Card'], language: 'Portuguese', region: 'South America' },
  { slug: 'germany', name: 'Germany', currency: 'EUR', symbol: '€', flag: '🇩🇪', exchanges: ['Coinbase', 'Kraken', 'Binance', 'Bitpanda'], paymentMethods: ['SEPA Transfer', 'Credit Card', 'SOFORT'], language: 'German', region: 'Europe' },
  { slug: 'france', name: 'France', currency: 'EUR', symbol: '€', flag: '🇫🇷', exchanges: ['Coinbase', 'Kraken', 'Binance', 'Paymium'], paymentMethods: ['SEPA Transfer', 'Credit Card', 'PayPal'], language: 'French', region: 'Europe' },
  { slug: 'uae', name: 'UAE', currency: 'AED', symbol: 'د.إ', flag: '🇦🇪', exchanges: ['Binance', 'BitOasis', 'Rain', 'OKX'], paymentMethods: ['Bank Transfer', 'Credit Card', 'PayBy'], language: 'Arabic/English', region: 'Middle East' },
  { slug: 'saudi-arabia', name: 'Saudi Arabia', currency: 'SAR', symbol: '﷼', flag: '🇸🇦', exchanges: ['Binance', 'Rain', 'OKX', 'Bybit'], paymentMethods: ['Bank Transfer', 'Mada Card', 'STC Pay'], language: 'Arabic', region: 'Middle East' },
  { slug: 'indonesia', name: 'Indonesia', currency: 'IDR', symbol: 'Rp', flag: '🇮🇩', exchanges: ['Indodax', 'Pintu', 'Tokocrypto', 'Binance'], paymentMethods: ['Bank Transfer', 'OVO', 'GoPay', 'Credit Card'], language: 'Indonesian', region: 'Asia' },
  { slug: 'philippines', name: 'Philippines', currency: 'PHP', symbol: '₱', flag: '🇵🇭', exchanges: ['Coins.ph', 'Binance', 'PDAX', 'OKX'], paymentMethods: ['GCash', 'PayMaya', 'Bank Transfer', 'Credit Card'], language: 'Filipino/English', region: 'Asia' },
  { slug: 'vietnam', name: 'Vietnam', currency: 'VND', symbol: '₫', flag: '🇻🇳', exchanges: ['Binance', 'VNDC', 'OKX', 'KuCoin'], paymentMethods: ['Bank Transfer', 'Momo', 'ZaloPay'], language: 'Vietnamese', region: 'Asia' },
  { slug: 'south-africa', name: 'South Africa', currency: 'ZAR', symbol: 'R', flag: '🇿🇦', exchanges: ['VALR', 'Luno', 'Binance', 'AltCoinTrader'], paymentMethods: ['Bank Transfer', 'Instant EFT', 'Credit Card'], language: 'English', region: 'Africa' },
  { slug: 'canada', name: 'Canada', currency: 'CAD', symbol: 'CA$', flag: '🇨🇦', exchanges: ['Coinbase', 'Kraken', 'Binance', 'Newton'], paymentMethods: ['Interac e-Transfer', 'Bank Wire', 'Credit Card'], language: 'English/French', region: 'North America' },
  { slug: 'australia', name: 'Australia', currency: 'AUD', symbol: 'A$', flag: '🇦🇺', exchanges: ['CoinSpot', 'Swyftx', 'Coinbase', 'Binance'], paymentMethods: ['PayID', 'Bank Transfer', 'Credit Card', 'POLi'], language: 'English', region: 'Oceania' },
  { slug: 'mexico', name: 'Mexico', currency: 'MXN', symbol: '$', flag: '🇲🇽', exchanges: ['Binance', 'Bitso', 'Coinbase', 'OKX'], paymentMethods: ['SPEI', 'OXXO', 'Credit Card', 'Bank Transfer'], language: 'Spanish', region: 'North America' },
  { slug: 'argentina', name: 'Argentina', currency: 'ARS', symbol: '$', flag: '🇦🇷', exchanges: ['Binance', 'Lemon Cash', 'Ripio', 'Satoshi Tango'], paymentMethods: ['Bank Transfer', 'Mercado Pago', 'Credit Card'], language: 'Spanish', region: 'South America' },
  { slug: 'egypt', name: 'Egypt', currency: 'EGP', symbol: 'E£', flag: '🇪🇬', exchanges: ['Binance', 'OKX', 'KuCoin', 'Bybit'], paymentMethods: ['Bank Transfer', 'Fawry', 'Vodafone Cash'], language: 'Arabic', region: 'Africa/Middle East' },
  { slug: 'kenya', name: 'Kenya', currency: 'KES', symbol: 'KSh', flag: '🇰🇪', exchanges: ['Binance', 'Yellow Card', 'Paxful', 'KuCoin'], paymentMethods: ['M-Pesa', 'Bank Transfer', 'Airtel Money'], language: 'Swahili/English', region: 'Africa' },
  { slug: 'ghana', name: 'Ghana', currency: 'GHS', symbol: 'GH₵', flag: '🇬🇭', exchanges: ['Binance', 'Yellow Card', 'KuCoin', 'Bybit'], paymentMethods: ['Mobile Money', 'Bank Transfer', 'MTN MoMo'], language: 'English', region: 'Africa' },
  { slug: 'japan', name: 'Japan', currency: 'JPY', symbol: '¥', flag: '🇯🇵', exchanges: ['bitFlyer', 'Coincheck', 'GMO Coin', 'Binance'], paymentMethods: ['Bank Transfer', 'Credit Card', 'konbini'], language: 'Japanese', region: 'Asia' },
  { slug: 'south-korea', name: 'South Korea', currency: 'KRW', symbol: '₩', flag: '🇰🇷', exchanges: ['Upbit', 'Bithumb', 'Coinone', 'Korbit'], paymentMethods: ['Bank Transfer', 'Credit Card'], language: 'Korean', region: 'Asia' },
  { slug: 'singapore', name: 'Singapore', currency: 'SGD', symbol: 'S$', flag: '🇸🇬', exchanges: ['Coinbase', 'Gemini', 'Independent Reserve', 'Binance'], paymentMethods: ['PayNow', 'Bank Transfer', 'Credit Card'], language: 'English', region: 'Asia' },
  { slug: 'malaysia', name: 'Malaysia', currency: 'MYR', symbol: 'RM', flag: '🇲🇾', exchanges: ['Luno', 'MX Global', 'Tokenize', 'Binance'], paymentMethods: ['FPX', 'DuitNow', 'Bank Transfer'], language: 'Malay/English', region: 'Asia' },
  { slug: 'thailand', name: 'Thailand', currency: 'THB', symbol: '฿', flag: '🇹🇭', exchanges: ['Bitkub', 'Satang', 'Binance', 'OKX'], paymentMethods: ['PromptPay', 'Bank Transfer', 'Credit Card'], language: 'Thai', region: 'Asia' },
  { slug: 'bangladesh', name: 'Bangladesh', currency: 'BDT', symbol: '৳', flag: '🇧🇩', exchanges: ['Binance', 'KuCoin', 'OKX', 'Bybit'], paymentMethods: ['bKash', 'Nagad', 'Bank Transfer'], language: 'Bengali', region: 'Asia' },
  { slug: 'sri-lanka', name: 'Sri Lanka', currency: 'LKR', symbol: 'Rs', flag: '🇱🇰', exchanges: ['Binance', 'KuCoin', 'OKX', 'Bybit'], paymentMethods: ['Bank Transfer', 'Credit Card'], language: 'Sinhala/Tamil', region: 'Asia' },
  { slug: 'spain', name: 'Spain', currency: 'EUR', symbol: '€', flag: '🇪🇸', exchanges: ['Coinbase', 'Kraken', 'Binance', 'Bit2Me'], paymentMethods: ['SEPA Transfer', 'Credit Card', 'Bizum'], language: 'Spanish', region: 'Europe' },
]

// Get country by slug
export function getCountry(slug) {
  return COUNTRIES.find(c => c.slug === slug) || null
}

// Get all slugs for generateStaticParams
export function getAllCountrySlugs() {
  return COUNTRIES.map(c => c.slug)
}
