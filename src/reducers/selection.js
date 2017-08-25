import { UNION, SUBTRACT, EXCLUSIVE, NONE } from '../actions/selection';

export default function selection(state = [], action) {
  const { ids } = action;
  switch (action.type) {
    case UNION:
      return [...ids, ...state.filter(id => ids.indexOf(id) === -1)];
    case SUBTRACT:
      return state.filter(id => ids.indexOf(id) === -1);
    case EXCLUSIVE:
      return [...ids];
  }
  return state;
}
