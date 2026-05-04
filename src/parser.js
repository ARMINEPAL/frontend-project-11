const parseRSS = (data) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString( data, "application/xml")
    
    const channel = doc.querySelector('channel')

    if (!channel) {
    const error = new Error('parse')
    error.type = 'parse'
    throw error
  }

    const feed = {
        title: channel.querySelector('title').textContent,
        description: channel.querySelector('description').textContent,
      }

    const posts = [...channel.querySelectorAll('item')].map((item) => {
        return {
            title: item.querySelector('title').textContent,
            link: item.querySelector('link').textContent,
        }
    })

    return { feed, posts }
}

export default parseRSS