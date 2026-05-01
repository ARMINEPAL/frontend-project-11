import 'bootstrap/dist/css/bootstrap.min.css'
import * as yup from 'yup'
import initView from './view.js'
import { initState } from './state.js'


const createSchema = (feeds) => {
  const urls = feeds.map((feed) => feed.url)
  return yup.object().shape({
    url: yup.string()
    .required('Не должно быть пустым')
    .url('Ссылка должна быть валидным URL')
    .notOneOf(urls, 'RSS уже существует')
  })
} 

const validate = async (url, feeds) => {
  const schema = createSchema(feeds)
  try {
    await schema.validate({ url })
    return null
  }
  catch (e) {
    return e.message
  }
}

initView()

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