import { proxy } from 'valtio/vanilla';

export const initState = proxy({
  form: {
    valid: null,
    error: null,
  },
  feeds: [],
});