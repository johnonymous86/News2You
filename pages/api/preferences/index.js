import { withIronSessionApiRoute } from 'iron-session/next'
import sessionOptions from '../../../config/session'
import { getPreferences, savePreferences } from '../../../controllers/preferences'

export default withIronSessionApiRoute(
  async function handler(req, res) {
    const user = req.session.user
    if (!user) return res.status(401).json({ error: 'Not logged in' })

    switch (req.method) {
      case 'GET':
        return getPreferences(req, res, user)
      case 'POST':
        return savePreferences(req, res, user)
      default:
        return res.status(405).end()
    }
  },
  sessionOptions
)