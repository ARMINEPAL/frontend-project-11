import { proxy } from 'valtio/vanilla';

export const initState = proxy({
  form: {
    valid: null,
    error: null,
  },
  loadingProcess: {
    status: 'idle',
    error: null,
  },
  feeds: [],
});