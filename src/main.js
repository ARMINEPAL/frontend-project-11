import 'bootstrap/dist/css/bootstrap.min.css'
import * as yup from 'yup'
import { setLocale } from 'yup'
import initView from './view.js'
import { initState } from './state.js'
import resources from './locales/index.js'
import i18next from 'i18next'
import load from './api.js'
import parseRSS from './parser.js'
import { uniqueId } from 'lodash'

const defaultLanguage = 'ru'

setLocale({
  mixed: {
    required: () => ({ key: 'errors.required'}),
    notOneOf: () => ({ key: 'errors.notOneOf'})
  },
  string: {
    url: () => ({ key: 'errors.url'}),
  },
})
const createSchema = (feeds) => {
  const urls = feeds.map((feed) => feed.url)
  return yup.object().shape({
    url: yup.string()
    .required()
    .url()
    .notOneOf(urls)
  })
} 

const validate = async (url, feeds) => {
  const schema = createSchema(feeds)
  try {
    await schema.validate({ url })
    return null
  }
  catch (e) {
    return e.message?.key || e.message
  }
}

const i18n = i18next.createInstance()

await i18n.init({
  lng: defaultLanguage,
  debug:false,
  resources,
})

initView(i18n)

const form = document.querySelector('#rssForm');
const input = document.querySelector('#rssUrl');

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const url = input.value
  console.log('START SUBMIT')
  const error = await validate(url, initState.feeds)
  console.log('VALIDATE RESULT:', error)
  if (error) {
    initState.form.valid = false
    initState.form.error = error
    console.log('VALIDATION FAILED')
    return
  }
  console.log('VALIDATION PASSED')
  try {
    const data = await load(url)
    console.log('LOADED DATA')
    const {feed, posts} = parseRSS(data)
    console.log('PARSED')
    feed.id = uniqueId()
    feed.url = url
    const relatedPosts = posts.map(post => {
      return {
    ...post,
    id: uniqueId(),
    feedId: feed.id
  }
})
initState.feeds.push(feed)
initState.posts.push(...relatedPosts)
initState.form.valid = true
initState.form.error = null
input.value = '';
input.focus();
  }
  catch (e) {
    initState.form.valid = false
    initState.form.error = 'errors.network'
    console.log('CATCH ERROR:', e)

  }
    
})