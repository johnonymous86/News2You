import { Schema, model, models } from 'mongoose'

const PreferenceSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  topics: {
    type: [String],
    default: []
  },
  keywords: {
    type: [String],
    default: []
  },
  sources: {
    type: [String],
    default: []
  }
}, { timestamps: true })

export default models.Preference || model('Preference', PreferenceSchema)