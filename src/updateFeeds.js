import load from './api.js'
import parseRSS from './parser.js'
import { uniqueId } from 'lodash'

const updateFeeds = (state) => {
  const promises = state.feeds.map(async ({ id, url }) => {
    const data = await load(url)
    const { posts } = parseRSS(data)
    const existingLinks = state.posts.map(p => p.link)

    const newPosts = posts
      .filter(post => !existingLinks.includes(post.link))
      .map(post => ({
        ...post,
        id: uniqueId(),
        feedId: id,
      }))

    if (newPosts.length > 0) {
      state.posts.unshift(...newPosts)
    }
  })

  Promise.all(promises).finally(() => {
    setTimeout(() => updateFeeds(state), 5000)
  })
}

export default updateFeeds
