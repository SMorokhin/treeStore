import { readonly, shallowRef } from "vue"
import MOCK_DATA from '~/mock/tree_store_data.json';

export default function useFetch<T>(endpoint: string, params: Record<string, unknown>) {
  const state = shallowRef<T[]>([]);
  const loading = shallowRef<boolean>(false);

  function asyncFetch(enpoint: string, params: Record<string, unknown>): Promise<T[]> {
    return new Promise((resolve) => {
      resolve(MOCK_DATA as T[]);
  })
}

  function get(): Promise<unknown> {
    loading.value = true;

    return asyncFetch(endpoint, params).then((response) => {
      const promise = new Promise<T[]>((resolve) => {
        setTimeout(() => {
          resolve(response)
        }, 3)
      })

      return promise;
    }).then((data) => {
      state.value = data;
    }).finally(() => {
      loading.value = false;
    })
  }

  function reset() {
    state.value = [];
  }

  return {
    state,
    loading,

    get,
    reset,
  }
}