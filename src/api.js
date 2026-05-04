import axios from "axios"

const getProxyUrl = (url) => {
    return `https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&cache=false`
  }
  
const load = async (url) => {
    const response = await axios.get(getProxyUrl(url))
   return response.data.contents
  }

  export default load