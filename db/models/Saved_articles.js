import { Schema, model, models } from 'mongoose'

const SavedArticleSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  url: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  sourceName: {
    type: String,
    default: ''
  },
  publishedAt: {
    type: String,
    default: ''
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

export default models.SavedArticle || model('SavedArticle', SavedArticleSchema)