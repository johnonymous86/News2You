import Preference from './models/preference'
import dbConnect from './connection'

export async function getByUserId(userId) {
    await dbConnect()
    const preference = await Preference.findOne({ userId }).lean()
    return preference || null
}

export async function upsert(userId, { topics, keywords, sources }) {
    await dbConnect()
    const preference = await Preference.findOneAndUpdate(
        { userId },
        { topics, keywords, sources },
        { new: true, upsert: true, runValidators: true }
    ).lean()
    if (!preference) throw new Error('Error saving your preferences! Please try again')
    return preference
}