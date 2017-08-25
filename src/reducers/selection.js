import { UNION, SUBTRACT, EXCLUSIVE } from '../actions/selection';

export default function selection(state = [], action) {
  const { id } = action;
  switch (action.type) {
    case UNION:
      return [id, ...state.filter(t => t !== id)];
    case SUBTRACT:
      return state.filter(t => t !== id);
    case EXCLUSIVE:
      return [id];
  }
  return state;
}
