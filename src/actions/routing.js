import { push } from 'react-router-redux';

// Pushes but preserves the query string
export function push_path(to) {
  return (dispatch, getState) => {
    const { router } = getState();
    if (router.location.search !== "") {
      dispatch(push(`${to}${router.location.search}`));
    } else {
      dispatch(push(to));
    }
  };
}

export function push_query(to) {
  return (dispatch, getState) => {
    const { router } = getState();
    dispatch(push(`${
      router.location.pathname === "/" ? "" : router.location.pathname
    }${to}`))
  };
}
