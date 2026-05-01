import { subscribe, snapshot } from 'valtio/vanilla'
import { initState } from './state.js'

let input
let container
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
  container = document.querySelector('.container');

  textCheck = document.createElement('span');
  container.append(textCheck)
    subscribe(initState, render)
    render()
}