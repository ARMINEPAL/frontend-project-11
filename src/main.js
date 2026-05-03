import 'bootstrap/dist/css/bootstrap.min.css'
import * as yup from 'yup'
import { setLocale } from 'yup'
import initView from './view.js'
import { initState } from './state.js'
import resources from './locales/index.js'
import i18next from 'i18next'

const defaultLanguage = 'ru'

setLocale({
  mixed: {
    required: () => ({ key: 'errors.required'}),
    notOneOf: () => ({ key: 'errors.shoudEqual'})
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
    return e.message.key
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
  const error = await validate(url, initState.feeds)
  initState.form.valid = !error
  initState.form.error = error

  if (!error) {
    initState.feeds.push({ url });

    input.value = '';
    initState.form.error = null;
    input.focus();
  }
})