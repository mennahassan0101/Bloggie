import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import './Navbar.css';

function initials(name = '') {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="nav">
      <NavLink to="/" className="logo">
        after<span>glow</span>
      </NavLink>
      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'is-active' : '')}>
          Feed
        </NavLink>
      </div>
      <div className="nav-cta">
        <NotificationBell />
        <div className="avatar" style={{ background: 'var(--sage)' }}>
          {user?.image ? (
            <img src={user.image} alt={user.name} />
          ) : (
            initials(user?.name)
          )}
        </div>
        <button onClick={logout}>Log out</button>
      </div>
    </nav>
  );
}