import 'bootstrap/dist/css/bootstrap.min.css'
import * as yup from 'yup'
import { setLocale } from 'yup'
import initView from './view.js'
import { initState } from './state.js'
import resources from './locales/index.js'
import i18next from 'i18next'
import loadFeed from './feedLoader.js'
import updateFeeds from './updateFeeds.js'
import * as bootstrap from 'bootstrap'

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
updateFeeds(initState)
const form = document.querySelector('#rssForm');
const input = document.querySelector('#rssUrl');

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const url = input.value
  const error = await validate(url, initState.feeds)

  if (error) {
    initState.form.valid = false
    initState.form.error = error
    return
  }

  try {
    const { feed, posts } = await loadFeed(url)
    initState.feeds.push(feed)
    initState.posts.push(...posts)
    initState.form.valid = true
    initState.form.error = null
    input.value = '';
    input.focus();
  }
  catch (e) {
    initState.form.valid = false

    if (e.message === 'parse') {
      initState.form.error = 'errors.parse'
    } else {
      initState.form.error = 'errors.network'
    }
  }
    
})

document.addEventListener('click', (e) => {
  const button = e.target.closest('button')
  if (!button) return

  const id = button.dataset.id

  if (!initState.ui.seenPosts.includes(id)) {
    initState.ui.seenPosts.push(id)
  }
  const post = initState.posts.find((p) => String(p.id) === id)

  if (!post) return

  document.querySelector('.modal-title').textContent = post.title
  document.querySelector('.modal-body p').textContent = post.description || ''
  document.querySelector('.modal-footer a').href = post.link

  const modal = new bootstrap.Modal(document.getElementById('modal'))
  modal.show()
})

//post - {title, link, id, feedId}