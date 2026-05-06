import axios from 'axios'

const getProxyUrl = (url) => {
  const proxy = 'https://allorigins.hexlet.app/get'
  return `${proxy}?disableCache=true&url=${encodeURIComponent(url)}`
}

const load = async (url) => {
  const response = await axios.get(getProxyUrl(url))
  return response.data.contents
}

export default load