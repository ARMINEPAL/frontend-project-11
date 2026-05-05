import { subscribe, snapshot } from 'valtio/vanilla'
import { initState } from './state.js'

let input
let form
let textCheck

const renderFeeds = (feeds = []) => {
  const feedsContainer = document.querySelector('#feeds')
  feedsContainer.innerHTML = ''
  feeds.forEach((feed) => {
    const div = document.createElement('div')

    div.classList.add('mb-3')

    div.innerHTML = `
      <h3>${feed.title}</h3>
      <p>${feed.description}</p>
    `

    feedsContainer.append(div)})
}

const renderPosts = (posts, seenPosts) => {
  if (!posts) return
  const container = document.querySelector('#posts')

  container.innerHTML = ''

  const ul = document.createElement('ul')
  ul.classList.add('list-group')

  posts.forEach((post) => {
    const li = document.createElement('li')
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center')

    const a = document.createElement('a')
    a.href = post.link
    a.textContent = post.title
    a.target = '_blank'

    if (readPosts.includes(post.id)) {
      a.classList.add('fw-normal')
    } else {
      a.classList.add('fw-bold')
    }
    
    const button = document.createElement('button')
    button.textContent = 'Просмотр'
    button.dataset.id = post.id
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm')

    li.append(a, button)
    ul.append(li)
  })

  container.append(ul)
}

const render = (i18n) => {
  const snap = snapshot(initState)
  if (snap.feeds.length > 0) {
    renderFeeds(snap.feeds)
  }
  
  if (snap.posts.length > 0) {
    renderPosts(snap.posts)
  }

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
  const container = document.querySelector('.mainContainer')

  container.innerHTML = `<div class="row container">

  <section class="col-6">
    <h4>${i18n.t('posts.title')}</h4>
    <div id="posts"></div>
  </section>

  <section class="col-6">
    <h4>${i18n.t('feeds.title')}</h4>
    <div id="feeds"></div>
  </section>

</div>
`
  input = document.querySelector('#rssUrl')
  form = document.querySelector('#rssForm')
  textCheck = document.createElement('span')
  form.append(textCheck)
  subscribe(initState, () => render(i18n))
  render(i18n)
}