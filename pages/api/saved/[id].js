import { withIronSessionApiRoute } from "iron-session/next";    
import sessionOptions from "../../../../config/session"
import { markAsRead, remove } from '../../../../db/savedArticle'

export default withIronSessionApiRoute(
    async function handler(req, res) {
        const user = req.session.user
        if (!user) return res.status(401).json({ error: "You're not logged in."})
        
        switch (req.method) {}
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