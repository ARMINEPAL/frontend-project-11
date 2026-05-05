import { proxy } from 'valtio/vanilla';

export const initState = proxy({
  form: {
    valid: null,
    error: null,
  },
  isLoading: false;
  feeds: [],
  posts: [],
  ui: {
    seenPosts: [],
    //new Set()
  }
})