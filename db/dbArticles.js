import SavedArticle from './models/model_articles'
import dbConnect from './connection'

export async function getByUserId(userId) {
  await dbConnect()
  const articles = await SavedArticle.find({ userId }).lean()
  return articles
}

export async function create(userId, article) {
  await dbConnect()
  const saved = await SavedArticle.create({ userId, ...article })
  if (!saved) throw new Error('Error saving article')
  return saved.toJSON()
}

export async function markAsRead(id, userId) {
  await dbConnect()
  const article = await SavedArticle.findOneAndUpdate(
    { _id: id, userId },
    { isRead: true },
    { new: true }
  ).lean()
  if (!article) throw new Error('Article not found')
  return article
}

export async function remove(id, userId) {
  await dbConnect()
  const article = await SavedArticle.findOneAndDelete({ _id: id, userId }).lean()
  if (!article) throw new Error('Article not found')
  return article
}