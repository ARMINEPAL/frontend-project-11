import { subscribe, snapshot } from 'valtio/vanilla'
import { initState } from './state.js'

let input
let form
let textCheck

const render = (i18n) => {
  const snap = snapshot(initState)
  if(snap.form.valid === false) {
    textCheck.textContent = i18n.t(snap.form.error)
    input.classList.add('is-invalid')
    textCheck.classList.add('text-danger')
    textCheck.classList.remove('text-success')
  } 
  else if (snap.form.valid === true) {
    textCheck.textContent = i18n.t('success')

    input.classList.remove('is-invalid')

    textCheck.classList.remove('text-danger')
    textCheck.classList.add('text-success')
  }
  else {
   
    textCheck.textContent = '';

    input.classList.remove('is-invalid');

    textCheck.classList.remove('text-danger');
    textCheck.classList.remove('text-success');
  }
}

export default (i18n) => {
  input = document.querySelector('#rssUrl')
  form = document.querySelector('#rssForm')
  textCheck = document.createElement('span')
  form.append(textCheck)
  subscribe(initState, () => render(i18n))
  render(i18n)
}