import { withIronSessionApiRoute } from "iron-session/next"
import sessionOptions from "../../../config/session"
import { getByUserId } from "../../../db/preference"


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

async function getPreferences(req, res, user) {
    try {
        const preference = await getByUserId(user._id)
        res.status(200).json(preference || { topics: [], keywords: [], sources: [], })
    } catch (err) {
        res.status(500).json({ error: err.message})
    }
}

async function savePreferences(req, res, user) {
    try{
        const { topics = [], keywords = [], sources = [] }
        const preference = await upsert(user._id, { topics, keywords, sources })
        res.status(200).json(preference)
    }
}