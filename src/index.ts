import { useCallback, useReducer, useEffect } from 'react';

const myFetch = async (url: string, delay: number = 0) => {
  if (delay) {
    await new Promise(res => setTimeout(res, delay));
  }

  const res = await fetch(url);

  const _data = await res.json();
  return _data;
};

type Action = {
  type: string;
  payload?: any;
};

const dataFetchReducer = <T>() => (state: T, action: Action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        loading: true,
        error: false,
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        error: false,
        data: action.payload,
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        loading: false,
        error: true,
      };
    default:
      return state;
  }
};

export const useBasicFetch = <Data>(url?: string, delay: number = 0) => {
  type State = {
    error: boolean;
    loading: boolean;
    data?: Data;
  };

  const initialState: State = {
    error: false,
    loading: false,
    data: undefined,
  };

  const [state, dispatch] = useReducer(dataFetchReducer<State>(), initialState);

  const setFetching = () => {
    dispatch({ type: 'FETCH_INIT' });
  };

  const setError = () => {
    dispatch({ type: 'FETCH_FAILURE' });
  };

  const setResponse = (data: any) => {
    dispatch({ type: 'FETCH_SUCCESS', payload: data });
  };

  const fetchData = useCallback(async (url: string, delay: number = 0) => {
    setFetching();

    let res;
    try {
      res = await myFetch(url, delay);
    } catch (err) {
      setError();
    }

    setResponse(res);
  }, []);

  useEffect(() => {
    if (url) {
      fetchData(url, delay);
    }
  }, [fetchData, url, delay]);

  return {
    data: state.data,
    error: state.error,
    loading: state.loading,
    fetchData,
  };
};
