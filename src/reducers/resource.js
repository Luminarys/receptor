import { UPDATE_RESOURCES, RESOURCES_REMOVED } from '../actions/resources';

export default function resourceReducer(type) {
  return (state = {}, action) => {
    switch (action.type) {
      case UPDATE_RESOURCES:
        return {
          ...state,
          ...action.resources
            .filter(r => r.type === type)
            .reduce((s, r) => ({
              ...s,
              [r.id]: { ...state[r.id], ...r }
            }), {})
        };
      case RESOURCES_REMOVED:
        return Object.values(state)
          .filter(r => action.ids.indexOf(r.id) === -1)
          .reduce((s, r) => ({ ...s, [r.id]: r }), {});
    }
    return state;
  };
}
