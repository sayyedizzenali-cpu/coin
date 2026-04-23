export const dynamicParams = true
export const revalidate = 86400

export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }) {
  const term = params.term.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  return {
    title: 'What is ' + term + '? | CryptoWorld',
    description: 'Learn about ' + term + ' in cryptocurrency.',
  }
}

export default function GlossaryTermPage({ params }) {
  const term = params.term.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  return (
    <div style={{maxWidth:'1200px', margin:'0 auto', padding:'32px 24px'}}>
      <p><a href="/">Home</a> › <a href="/glossary">Glossary</a> › {term}</p>
      <h1>What is {term}?</h1>
      <p>{term} is an important concept in cryptocurrency and blockchain technology.</p>
      <a href="/glossary">Back to Glossary</a>
    </div>
  )
}