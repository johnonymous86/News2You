import Preference from './models/preference'
import dbConnect from './connection'

export async function getByUserId(userId) {
    await dbConnect()
    const preference = await Preference.findOne({ userId }).lean()
    return preference null
}