import { getByUserId, upsert } from '../db/preference'

export async function getPreferences(req, res, user) {
  try {
    const preference = await getByUserId(user._id)
    res.status(200).json(preference || { topics: [], keywords: [], sources: [] })
  } catch (err) {
    console.error('GET /api/preferences error:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export async function savePreferences(req, res, user) {
  try {
    const { topics = [], keywords = [], sources = [] } = req.body
    const preference = await upsert(user._id, { topics, keywords, sources })
    res.status(200).json(preference)
  } catch (err) {
    console.error('POST /api/preferences error:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}