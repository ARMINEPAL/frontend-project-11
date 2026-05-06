import { subscribe, snapshot } from 'valtio/vanilla'
import { initState } from './state.js'

let input
let textCheck

const renderFeeds = (feeds = [], i18n) => {
  const feedsContainer = document.querySelector('.feeds')

  feedsContainer.innerHTML = ''

  if (feeds.length === 0) return

  const title = document.createElement('h3')
  title.textContent = i18n.t('feeds.title')

  const ul = document.createElement('ul')
  ul.classList.add('list-group', 'mb-5')

  feeds.forEach((feed) => {
    const li = document.createElement('li')
    li.classList.add('list-group-item')

    const feedTitle = document.createElement('h3')
    feedTitle.textContent = feed.title

    const feedDescription = document.createElement('p')
    feedDescription.textContent = feed.description

    li.append(feedTitle, feedDescription)
    ul.append(li)
  })

  feedsContainer.append(title, ul)
}

const renderPosts = (posts = [], seenPosts = [], i18n) => {
  const postsContainer = document.querySelector('.posts')

  postsContainer.innerHTML = ''

  if (posts.length === 0) return

  const title = document.createElement('h3')
  title.textContent = i18n.t('posts.title')

  const ul = document.createElement('ul')
  ul.classList.add('list-group')

  posts.forEach((post) => {
    const li = document.createElement('li')
    li.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start'
    )

    const link = document.createElement('a')
    link.href = post.link
    link.textContent = post.title
    link.target = '_blank'
    link.rel = 'noopener noreferrer'

    if (seenPosts.includes(String(post.id))) {
      link.classList.add('link-secondary')
    } else {
      link.classList.add('fw-bold')
    }

    const button = document.createElement('button')
    button.textContent = i18n.t('buttons.preview')
    button.dataset.id = post.id
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm')

    li.append(link, button)
    ul.append(li)
  })

  postsContainer.append(title, ul)
}

const render = (i18n) => {
  const snap = snapshot(initState)

  renderFeeds(snap.feeds, i18n)
  renderPosts(snap.posts, snap.ui.seenPosts, i18n)

  if (snap.form.valid === false) {
    textCheck.textContent = i18n.t(snap.form.error)
    input.classList.add('is-invalid')

    textCheck.classList.add('text-danger')
    textCheck.classList.remove('text-success')
  } else if (snap.form.valid === true) {
    textCheck.textContent = i18n.t('success')
    input.classList.remove('is-invalid')

    textCheck.classList.remove('text-danger')
    textCheck.classList.add('text-success')
  } else {
    textCheck.textContent = ''
    input.classList.remove('is-invalid')

    textCheck.classList.remove('text-danger')
    textCheck.classList.remove('text-success')
  }
}

export default (i18n) => {
  input = document.querySelector('#rssUrl')
  textCheck = document.querySelector('.feedback')

  subscribe(initState, () => render(i18n))
  render(i18n)
}
