import { subscribe, snapshot } from 'valtio/vanilla'
import { initState } from './state.js'

let input
let form
let textCheck

const render = () => {
  const snap = snapshot(initState)
  if(snap.form.valid === false) {
    textCheck.textContent = snap.form.error
    input.classList.add('is-invalid')
    textCheck.classList.add('text-danger')
    textCheck.classList.remove('text-success')
  } 
  else if (snap.form.valid === true && snap.form.error === null) {
    textCheck.textContent = 'RSS загружен успешно';

    input.classList.remove('is-invalid')

    textCheck.classList.remove('text-danger')
    textCheck.classList.add('text-success')
  }
}

export default () => {
  input = document.querySelector('#rssUrl')
  form = document.querySelector('#rssForm')
  textCheck = document.createElement('span')
  form.append(textCheck)
  subscribe(initState, render)
  render()
}