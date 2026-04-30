import { withIronSessionApiRoute } from 'iron-session/next'
import sessionOptions from '../../config/session'
import { getByUserId } from '../../db/preference'
 
export default withIronSessionApiRoute(
  async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).end()
 
    const user = req.session.user
    if (!user) return res.status(401).json({ error: 'Not logged in' })
 
    try {
      const preference = await getByUserId(user._id)
 
      if (!preference || (
        preference.topics.length === 0 &&
        preference.keywords.length === 0 &&
        preference.sources.length === 0
      )) {
        return res.status(200).json({ articles: [], message: 'No preferences set.' })
      }
 
      const articles = await fetchArticles(preference)
      res.status(200).json({ articles })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },
  sessionOptions
)
 
async function fetchArticles({ topics, keywords, sources }) {
  const apiKey = process.env.NEWS_API_KEY
  
  const results = []
 
 
  for (const topic of topics) {
    const url = `https://newsapi.org/v2/top-headlines?category=${topic}&language=en&pageSize=10&apiKey=${apiKey}`
    const res = await fetch(url)
    const data = await res.json()
    if (data.articles) results.push(...data.articles)
  }
 


  if (keywords.length > 0 || sources.length > 0) {
    const params = new URLSearchParams()
    if (keywords.length > 0) params.set('q', keywords.join(' OR '))
    if (sources.length > 0) params.set('sources', sources.join(','))
    params.set('language', 'en')
    params.set('pageSize', '10')
    params.set('apiKey', apiKey)
 
      const url = `https://newsapi.org/v2/everything?${params.toString()}`
    const res = await fetch(url)
    const data = await res.json()
    if (data.articles) results.push(...data.articles)
  }
 



  const seen = new Set()
  return results.filter((article) => {
    if (seen.has(article.url)) return false
    seen.add(article.url)
    return true
  })
}