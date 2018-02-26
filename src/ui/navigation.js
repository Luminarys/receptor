import React from 'react';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import query from 'query-string';
import { search_criteria, search_qs, update_filter } from '../search';

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
        <span className="navbar-text">
          <Link to="/search-help">
            <FontAwesome name="question-circle" />
          </Link>
        </span>
      </ul>
    </div>
  </nav>;
}

export default connect(state => ({
  filter_subscribe: state.filter_subscribe,
  router: state.router,
}))(render);
