import {
  UPDATE_RESOURCES,
  RESOURCES_REMOVED
} from '../actions/resources';

export default function server(state = {}, action) {
  switch (action.type) {
    case UPDATE_RESOURCES:
      if (action.resources.length !== 1 ||
          action.resources[0].type !== "server") {
        return state;
      }
      return { ...state, ...action.resources[0] };
  }
  return state;
}
