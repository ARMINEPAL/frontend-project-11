import load from './api.js'
import parseRSS from './parser.js'
import { uniqueId } from 'lodash'

const loadFeed = async (url) => {
  const data = await load(url)
  const { feed, posts } = parseRSS(data)
  feed.id = uniqueId()
  feed.url = url
  const relatedPosts = posts.map((post) => {
    return {
      ...post,
      id: uniqueId(),
      feedId: feed.id,
    }
  })
  return { feed, posts: relatedPosts }
}

export default loadFeed
