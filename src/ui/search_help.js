import React, { Component } from 'react';
import { connect } from 'react-redux';
import query from 'query-string';
import { search_criteria, search_qs, update_filter } from '../search';

function SearchHelp(props) {
  const { dispatch, router } = props;
  const qs = query.parse(router.location.search);
  const update = text => update_filter(
    text || "", props.filter_subscribe, router.location, dispatch);
  const navto = where => e => {
    e.preventDefault();
    update(where);
  };
  const searchLink = target =>
    <a href={search_qs(target)} onClick={navto(target)} >{target}</a>;
  const searchableProps = {
    "name": "torrent name",
    "path": "download path",
    "status": "paused | pending | leeching | idle | seeding | hashing | error",
    "size": "size in bytes",
    "progress": "progress from 0 to 1",
    "priority": "1-5, low to high",
    "availability": "how much is available from the swarm, 0 to 1",
    "rate_up": "rate up in bits/sec",
    "rate_down": "rate down in bits/sec",
    "throttle_up": "throttle up in bits/sec",
    "throttle_down": "throttle down in bits/sec",
    "transferred_up": "total transfer up in bits/sec",
    "transferred_down": "total transfer down in bits/sec",
    "tracker": "tracker url",
    "peers": "number of peers",
    "trackers": "number of trackers",
    "files": "number of files",
  };

  return (
    <div>
      <h3>
        Search help
      </h3>
      <p>
        You can search for torrents using the search box at the top of the
        page. By default, it will search through torrent titles. You can also
        search other properties of torrents with
        <code>property<strong>operator</strong>value</code>, where operator is
        one of the following:
      </p>
      <ul>
        <li><code>:</code> matches values that contain <code>value</code></li>
        <li><code>==</code> matches values that are equal to <code>value</code></li>
        <li><code>!=</code> matches values that are not equal to <code>value</code></li>
        <li><code>></code> matches values that are greater than <code>value</code></li>
        <li><code>>=</code> matches values that are greater than or equal to <code>value</code></li>
        <li><code>&lt;</code> matches values that are less than <code>value</code></li>
        <li><code>&lt;=</code> matches values that are less than or equal to <code>value</code></li>
      </ul>
      <p>
        The following torrent properties are searchable:
      </p>
      <ul>
        {Object.keys(searchableProps).map(key =>
          <li><strong>{key}</strong>: {searchableProps[key]}</li>)}
      </ul>
      <p>
        Here are some example searches:
      </p>
      <ul>
        <li>{searchLink("state:seeding")}</li>
        <li>{searchLink("state:leeching")}</li>
        <li>{searchLink("rate_up>1048576")}</li>
        <li>{searchLink("files>1")}</li>
        <li>{searchLink("files==1")}</li>
        <li>{searchLink("progress<0.1")}</li>
        <li>{searchLink("tracker:archlinux.org")}</li>
      </ul>
    </div>
  );
}

export default connect(state => ({
  filter_subscribe: state.filter_subscribe,
  router: state.router,
}))(SearchHelp);
