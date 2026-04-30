import { withIronSessionApiRoute } from 'iron-session/next'
import sessionOptions from '../../../config/session'
import { getSavedArticles, saveArticle } from '../../../controllers/savedArticle'
 
export default withIronSessionApiRoute(
  async function handler(req, res) {
    const user = req.session.user
    if (!user) return res.status(401).json({ error: 'You're not logged in!' })
 
    switch (req.method) {
      case 'GET':
        return getSavedArticles(req, res, user)
      case 'POST':
        return saveArticle(req, res, user)
      default:
        return res.status(405).end()
    }
  },
  sessionOptions
)
 