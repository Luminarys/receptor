import React from 'react';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { filter_subscribe } from '../actions/filter_subscribe';
import { push } from 'react-router-redux';
import query from 'query-string';
import search_criteria from '../search';

function search_qs(text) {
  const qs = query.stringify({
    ...query.parse(location.search),
    s: text || undefined
  });
  return `${
    location.pathname === "/" ? location.pathname : ""
  }${qs && "?" + qs}`;
}

function update_filter(text, fs, location, dispatch) {
  // there will always be one torrent filter
  const tfilter = fs.filter(fs => fs.kind === "torrent")[0];
  const criteria = search_criteria(text);
  dispatch(filter_subscribe("torrent", criteria, tfilter.serial));
  dispatch(push(search_qs(text)));
}

function render(props) {
  const { dispatch, router } = props;
  const qs = query.parse(router.location.search);
  const update = text => update_filter(
    text || "", props.filter_subscribe, router.location, dispatch);
  const navto = where => e => {
    e.preventDefault();
    update(where);
  };
  const searchLink = (target, text) => <li className="nav-item">
    <a
      className={`nav-link ${qs.s === target && "active"}`}
      href={search_qs(target)}
      onClick={navto(target)}
    >{text}</a>
  </li>;
  return <nav className="navbar navbar-light navbar-toggleable-xl">
    <Link to="/" className="navbar-brand">receptor</Link>
    <div className="navbar-collapse collapse">
      <ul className="navbar-nav mr-auto">
        <li className="nav-item">
          <NavLink
            to="/add-torrent"
            className="nav-link btn-primary"
            activeClassName="nav-link active"
          >add torrent</NavLink>
        </li>
        <li className="nav-item" style={{minWidth: "1rem"}}>
        </li>
        {searchLink(undefined, "all")}
        {searchLink("status:leeching", "leeching")}
        {searchLink("status:seeding", "seeding")}
        <form className="form-inline">
          <input
            className="form-control mr-sm-2"
            type="text"
            placeholder="Search"
            aria-label="Search"
            value={qs.s}
            onChange={e => update(e.target.value)} />
        </form>
      </ul>
    </div>
  </nav>;
}

export default connect(state => ({
  filter_subscribe: state.filter_subscribe,
  router: state.router,
}))(render);
