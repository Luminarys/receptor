export const UPDATE_RESOURCES = 'UPDATE_RESOURCES';
export const RESOURCES_REMOVED = 'RESOURCES_REMOVED';
import ws_send from '../socket';

export const updateResource = (resource, cb) => dispatch => {
  dispatch({ type: UPDATE_RESOURCES, resources: [resource] });
  ws_send("UPDATE_RESOURCE", { resource }, cb);
};

// TODO: More resource actions (delete, etc) through this reducer?
