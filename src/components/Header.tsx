import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header id="banner" className="body">
      <h1>
        <Link to="/">InteractiVenn</Link>
        <strong>(Unions by list)</strong>
      </h1>
      <nav>
        <ul>
          <li className={isActive('/tree') ? 'active' : ''}>
            <Link to="/tree">Unions by tree</Link>
          </li>
          <li className={isActive('/') && location.pathname === '/' ? 'active' : ''}>
            <Link to="/">Unions by list</Link>
          </li>
          <li className={isActive('/citation') ? 'active' : ''}>
            <Link to="/citation">Citation</Link>
          </li>
          <li className={isActive('/contact') ? 'active' : ''}>
            <Link to="/contact">Contact</Link>
          </li>
          <li className={isActive('/help') ? 'active' : ''}>
            <Link to="/help">Help</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
