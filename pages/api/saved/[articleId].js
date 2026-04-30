import { withIronSessionApiRoute } from 'iron-session/next'
import sessionOptions from '../../../../config/session'
import { markAsRead, remove } from '../../../../db/savedArticle'

export default withIronSessionApiRoute(
  async function handler(req, res) {
    const user = req.session.user
    if (!user) return res.status(401).json({ error: 'Not logged in' })

    switch (req.method) {
      case 'PUT':
        return updateArticle(req, res, user)
      case 'DELETE':
        return deleteArticle(req, res, user)
      default:
        return res.status(405).end()
    }
  },
  sessionOptions
)

async function updateArticle(req, res, user) {
  try {
    const { articleId } = req.query
    const article = await markAsRead(articleId, user._id)
    res.status(200).json(article)
  } catch (err) {
    console.error('PUT /api/saved/[articleId] error:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

async function deleteArticle(req, res, user) {
  try {
    const { articleId } = req.query
    await remove(articleId, user._id)
    res.status(200).json({ message: 'Article removed' })
  } catch (err) {
    console.error('DELETE /api/saved/[articleId] error:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}