import 'bootstrap/dist/css/bootstrap.min.css'


import * as yup from 'yup'
import { proxy, subscribe, snapshot } from 'valtio/vanilla'

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

const initState = proxy({
  form: {
    valid: true,
    error: null,
  },
  feeds: []
})
const form = document.querySelector('#rssForm')
const input = document.querySelector('#rssUrl')
const container = document.querySelector('.container')
const textCheck = document.createElement('span')
container.append(textCheck)

const render = () => {
  const snap = snapshot(initState)
  if(snap.form.error) {
    textCheck.textContent = snap.form.error
    input.classList.add('is-invalid')
    textCheck.classList.add('text-danger');
  } else {
    textCheck.textContent = ''
    input.classList.remove('is-invalid')
  }
}

subscribe(initState, render)

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const url = input.value
  const error = await validate(url, initState.feeds)
  initState.form.error = error

  if (!error) {
    initState.feeds.push({ url });

    input.value = '';
    initState.form.error = null;
    input.focus();
  }
})

render()