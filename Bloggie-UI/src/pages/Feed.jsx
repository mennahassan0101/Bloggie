import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './Feed.css';

export default function Feed() {
  const { user } = useAuth();

  return (
    <div>
      <Navbar />
      <div className="feed-page">
        <h1>Welcome, {user?.name} 👋</h1>
        <p>
          You're authenticated — the token is being sent on every request via the axios
          interceptor. This is a placeholder for the posts feed; wire it up once the Posts CRUD
          endpoints exist on the backend.
        </p>
        <div className="card">
          <p style={{ margin: 0 }}>
            Logged in as <b>{user?.email}</b>
          </p>
        </div>
      </div>
    </div>
  );
}
