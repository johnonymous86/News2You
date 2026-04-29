import { withIronSessionApiRoute } from "iron-session/next"
import sessionOptions from "../../../config/session"
import { getByUserId } from "../../../db/preference"
import session from "../../../config/session"

export default withIronSessionApiRoute(
    async function handler(req, res) {
        const user = req.session.user
        if (!user) return res.status(401).json({ error: "You're not logged in"})
        
        switch (req.method) {
            case "GET":
                return getPreferences(req, res, user)
                case "POST"
                return savePreferences(req, res, user)
                default:
                    return res.status(405).end()
        }
    },
    sessionOptions
)