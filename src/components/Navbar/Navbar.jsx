import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo" onClick={closeMenu}>
          <span className="navbar__logo-icon">📚</span>
          <span className="navbar__logo-text">
            Library <strong>Freedom</strong>
          </span>
        </Link>

        {/* Desktop nav links */}
        <ul className="navbar__links">
          <li><NavLink to="/home" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
          <li><NavLink to="/categories" className={({ isActive }) => isActive ? 'active' : ''}>Categories</NavLink></li>
          <li><NavLink to="/popular" className={({ isActive }) => isActive ? 'active' : ''}>Popular</NavLink></li>
          <li><NavLink to="/latest" className={({ isActive }) => isActive ? 'active' : ''}>Latest</NavLink></li>
        </ul>

        {/* Auth buttons or user menu */}
        <div className="navbar__auth">
          {user ? (
            <div className="navbar__user">
              <Link
                to={user.role === 'admin' ? '/admin' : '/dashboard'}
                className="navbar__user-name"
                onClick={closeMenu}
              >
                👤 {user.name}
              </Link>
              <button className="btn btn--outline btn--sm" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn--ghost btn--sm" onClick={closeMenu}>Login</Link>
              <Link to="/signup" className="btn btn--primary btn--sm" onClick={closeMenu}>Sign Up</Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          className={`navbar__hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`navbar__mobile${menuOpen ? ' open' : ''}`}>
        <NavLink to="/home" onClick={closeMenu}>Home</NavLink>
        <NavLink to="/categories" onClick={closeMenu}>Categories</NavLink>
        <NavLink to="/popular" onClick={closeMenu}>Popular</NavLink>
        <NavLink to="/latest" onClick={closeMenu}>Latest</NavLink>
        {user ? (
          <>
            <NavLink to={user.role === 'admin' ? '/admin' : '/dashboard'} onClick={closeMenu}>
              {user.role === 'admin' ? 'Admin Panel' : 'My Dashboard'}
            </NavLink>
            <button className="btn btn--outline btn--sm" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn--ghost btn--sm" onClick={closeMenu}>Login</Link>
            <Link to="/signup" className="btn btn--primary btn--sm" onClick={closeMenu}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
