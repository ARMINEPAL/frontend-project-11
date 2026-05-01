import { proxy } from 'valtio/vanilla';

export const initState = proxy({
  form: {
    valid: true,
    error: null,
  },
  feeds: [],
});