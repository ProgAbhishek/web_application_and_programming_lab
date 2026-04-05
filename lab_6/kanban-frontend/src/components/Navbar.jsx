import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar({ projectName = null }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      {/* Left side */}
      <div style={styles.left}>
        {projectName && (
          <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
            ← 
          </button>
        )}
        <Link to="/dashboard" style={styles.brand}>
          🗂️ KanbanApp
        </Link>
        {projectName && (
          <>
            <span style={styles.separator}>/</span>
            <span style={styles.projectName}>{projectName}</span>
          </>
        )}
      </div>

      {/* Right side */}
      <div style={styles.right}>
        {user && (
          <>
            <div style={styles.avatar}>
              {user.username[0].toUpperCase()}
            </div>
            <span style={styles.username}>{user.username}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: '#4f46e5',
    padding: '0 1.5rem',
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  backBtn: {
    background: 'transparent',
    border: 'none',
    color: '#c7d2fe',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '6px',
  },
  brand: {
    color: '#fff',
    fontWeight: 700,
    fontSize: '1.1rem',
    textDecoration: 'none',
    letterSpacing: '0.3px',
  },
  separator: {
    color: '#818cf8',
    fontSize: '16px',
  },
  projectName: {
    color: '#c7d2fe',
    fontSize: '15px',
    fontWeight: 500,
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#818cf8',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '14px',
  },
  username: {
    color: '#c7d2fe',
    fontSize: '14px',
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid #818cf8',
    color: '#c7d2fe',
    padding: '5px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
  },
};