import React from 'react';

export default function render(props) {
  return <nav className="navbar navbar-light navbar-toggleable-xl">
    <span className="navbar-brand">receptor</span>
    <div className="navbar-collapse collapse">
      <ul className="navbar-nav mr-auto">
        <li className="nav-item">
          <a className="nav-link" href="#">all</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">leeching</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">seeding</a>
        </li>
      </ul>
    </div>
  </nav>;
}
