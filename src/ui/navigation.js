import React from 'react';

export default function render(props) {
  return <nav className="navbar navbar-light navbar-toggleable-xl">
    <span className="navbar-brand">receptor</span>
    <div className="navbar-collapse collapse">
      <ul className="navbar-nav mr-auto">
        <li className="nav-item">
          <a className="nav-link" href="#">add torrent</a>
        </li>
        <li className="nav-item" style={{minWidth: "1rem"}}>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">all</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">leeching</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">seeding</a>
        </li>
        <form className="form-inline">
          <input
            className="form-control mr-sm-2"
            type="text"
            placeholder="Search"
            aria-label="Search" />
        </form>
      </ul>
    </div>
  </nav>;
}
