import {
  FILTER_SUBSCRIBE,
  FILTER_UNSUBSCRIBE
} from '../actions/filter_subscribe';

export default function filter_subscribe(state = [], action) {
  switch (action.type) {
    case FILTER_SUBSCRIBE: {
      const { serial, kind, criteria } = action;
      return [
        ...state,
        {
          serial,
          kind,
          criteria
        }
      ];
    }
    case FILTER_UNSUBSCRIBE: {
      const { serial } = action;
      return state.filter(filter => filter.serial !== serial);
    }
  }
  return state;
}
