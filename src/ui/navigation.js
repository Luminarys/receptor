import React from 'react';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { filter_subscribe } from '../actions/filter_subscribe';
import { push } from 'react-router-redux';
import query from 'query-string';

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
  dispatch(push(search_qs(text)));
}

function render(props) {
  const { dispatch, router } = props;
  const qs = query.parse(router.location.search);
  const navto = where => e => {
    e.preventDefault();
    dispatch(push(where));
  };
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
        <li className="nav-item">
          <a
            className="nav-link"
            href={search_qs("")}
            onClick={navto(search_qs(""))}
          >all</a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            href={search_qs("status:leeching")}
            onClick={navto(search_qs("status:leeching"))}
          >leeching</a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            href={search_qs("status:seeding")}
            onClick={navto(search_qs("status:seeding"))}
          >seeding</a>
        </li>
        <form className="form-inline">
          <input
            className="form-control mr-sm-2"
            type="text"
            placeholder="Search"
            aria-label="Search"
            value={qs.s}
            onChange={e => update_filter(
              e.target.value,
              props.filter_subscribe,
              router.location,
              dispatch)} />
        </form>
      </ul>
    </div>
  </nav>;
}

export default connect(state => ({
  filter_subscribe: state.filter_subscribe,
  router: state.router,
}))(render);
