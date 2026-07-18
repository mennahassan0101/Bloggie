import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import './Feed.css';

function isExpired(createdAt) {
  const created = new Date(createdAt).getTime();
  return Date.now() - created > 24 * 60 * 60 * 1000;
}

export default function Feed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showExpired, setShowExpired] = useState(true);

  const fetchPosts = useCallback(async (pageToLoad) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/posts', { params: { page: pageToLoad } });
      setPosts(data.data);
      setMeta(data.meta);
    } catch (err) {
      setError('Could not load the feed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function handleDelete(postId) {
    const confirmed = window.confirm('Delete this post? This cannot be undone.');
    if (!confirmed) return;

    // optimistic removal
    const previousPosts = posts;
    setPosts((prev) => prev.filter((p) => p.id !== postId));

    api.delete(`/posts/${postId}`).catch(() => {
      setError('Could not delete the post. Please try again.');
      setPosts(previousPosts);
    });
  }

  const visiblePosts = showExpired ? posts : posts.filter((post) => !isExpired(post.created_at));

  return (
    <div>
      <Navbar />
      <div className="feed-page">
        <div className="feed-header">
          <div>
            <h1>Welcome, {user?.name?.split(' ')[0] || 'there'} 👋</h1>
            <p>Fresh posts from everyone, newest first.</p>
          </div>
          <Link to="/posts/new" className="btn btn-primary">
            New post
          </Link>
        </div>

        <div className="feed-toolbar">
          <label className="expired-toggle">
            <input
              type="checkbox"
              checked={showExpired}
              onChange={(e) => setShowExpired(e.target.checked)}
            />
            Show expired posts
          </label>
        </div>

        {error && <div className="banner-error">{error}</div>}

        {loading ? (
          <div className="feed-state">Loading posts…</div>
        ) : visiblePosts.length === 0 ? (
          <div className="feed-state">
            {posts.length === 0
              ? 'No posts yet — be the first to write one.'
              : 'All posts on this page have expired. Toggle "Show expired posts" to see them.'}
          </div>
        ) : (
          <div className="post-list">
            {visiblePosts.map((post) => (
              <PostCard key={post.id} post={post} onDelete={handleDelete} />
            ))}
          </div>
        )}

        {meta && meta.last_page > 1 && (
          <div className="pagination">
            <button
              type="button"
              className="btn btn-ghost"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Newer
            </button>
            <span className="pagination-status">
              Page {meta.current_page} of {meta.last_page}
            </span>
            <button
              type="button"
              className="btn btn-ghost"
              disabled={page >= meta.last_page}
              onClick={() => setPage((p) => p + 1)}
            >
              Older →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}