import { getByUserId, create, markAsRead, remove } from '../db/dbArticles'

export async function getSavedArticles(req, res, user) {
  try {
    const articles = await getByUserId(user._id)
    res.status(200).json(articles)
  } catch (err) {
    console.error('GET /api/saved error:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export async function saveArticle(req, res, user) {
  try {
    const { title, description, url, imageUrl, sourceName, publishedAt } = req.body
    if (!title || !url) return res.status(400).json({ error: 'Title and URL are required' })
    const article = await create(user._id, { title, description, url, imageUrl, sourceName, publishedAt })
    res.status(201).json(article)
  } catch (err) {
    console.error('POST /api/saved error:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export async function updateArticle(req, res, user) {
  try {
    const { articleId } = req.query
    const article = await markAsRead(articleId, user._id)
    res.status(200).json(article)
  } catch (err) {
    console.error('PUT /api/saved/[articleId] error:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export async function deleteArticle(req, res, user) {
  try {
    const { articleId } = req.query
    await remove(articleId, user._id)
    res.status(200).json({ message: 'Article removed' })
  } catch (err) {
    console.error('DELETE /api/saved/[articleId] error:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}