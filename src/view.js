import { subscribe, snapshot } from 'valtio/vanilla'
import { initState } from './state.js'

let input
let form
let textCheck

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

export default () => {
  input = document.querySelector('#rssUrl');
  form = document.querySelector('#rssForm')
  textCheck = document.createElement('span');
  form.append(textCheck)
  subscribe(initState, render)
  render()
}