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

// via https://stackoverflow.com/a/46946490
const ssplit = str => str.match(/\\?.|^$/g).reduce((p, c) => {
    if (c === '"') {
        p.quote ^= 1;
    } else if (!p.quote && c === ' ') {
        p.a.push('');
    } else {
        p.a[p.a.length-1] += c.replace(/\\(.)/,"$1");
    }
    return p;
}, {a: ['']}).a;

function search_criteria(text) {
  const terms = ssplit(text);
  return terms.map(t => {
    if (t.indexOf("status:") === 0) {
      return {
        field: "status",
        op: "==",
        value: t.split(":")[1]
      };
    } else {
      return {
        field: "name",
        op: "ilike",
        value: `%${t}%`
      };
    }
  });
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
