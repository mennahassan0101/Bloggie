import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import CommentItem from '../components/CommentItem';
import { initials, timeAgo, expiryInfo } from '../utils/postTime';
import '../components/PostCard.css';
import './PostDetail.css';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [commentBody, setCommentBody] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentError, setCommentError] = useState('');

  const fetchPost = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/posts/${id}`);
      setPost(data.data);
    } catch (err) {
      setError(err.response?.status === 404 ? 'Post not found.' : 'Could not load this post.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  async function handleAddComment(e) {
    e.preventDefault();
    setCommentError('');
    if (!commentBody.trim()) {
      setCommentError('Write something first.');
      return;
    }
    setCommentSubmitting(true);
    try {
      const { data } = await api.post(`/posts/${id}/comments`, { body: commentBody.trim() });
      const newComment = data.data ?? data;
      setPost((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), newComment],
      }));
      setCommentBody('');
    } catch (err) {
      setCommentError(
        err.response?.data?.errors?.body?.[0] || 'Could not post your comment. Please try again.'
      );
    } finally {
      setCommentSubmitting(false);
    }
  }

  async function handleUpdateComment(commentId, newBody) {
    const { data } = await api.put(`/comments/${commentId}`, { body: newBody });
    const updated = data.data ?? data;
    setPost((prev) => ({
      ...prev,
      comments: prev.comments.map((c) => (c.id === commentId ? updated : c)),
    }));
  }

  function handleDeleteComment(commentId) {
    const previousComments = post.comments;
    setPost((prev) => ({
      ...prev,
      comments: prev.comments.filter((c) => c.id !== commentId),
    }));
    api.delete(`/comments/${commentId}`).catch(() => {
      setError('Could not delete the comment. Please try again.');
      setPost((prev) => ({ ...prev, comments: previousComments }));
    });
  }

  function handleDeletePost() {
    const confirmed = window.confirm('Delete this post? This cannot be undone.');
    if (!confirmed) return;
    api
      .delete(`/posts/${id}`)
      .then(() => navigate('/'))
      .catch(() => setError('Could not delete the post. Please try again.'));
  }

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="post-detail-page">
          <div className="post-detail-state">Loading post…</div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div>
        <Navbar />
        <div className="post-detail-page">
          <div className="banner-error">{error || 'Could not load this post.'}</div>
          <Link to="/" className="btn-text">
            ← Back to feed
          </Link>
        </div>
      </div>
    );
  }

  const expiry = expiryInfo(post.created_at);
  const comments = post.comments || [];

  return (
    <div>
      <Navbar />
      <div className="post-detail-page">
        <Link to="/" className="btn-text back-link">
          ← Back to feed
        </Link>

        {error && <div className="banner-error">{error}</div>}

        <article className="post-detail-card">
          <div className="post-card-head">
            <div className="post-author">
              <div className="avatar" style={{ background: 'var(--sky)' }}>
                {post.author?.image ? (
                  <img src={post.author.image} alt={post.author.name} />
                ) : (
                  initials(post.author?.name)
                )}
              </div>
              <div>
                <div className="post-author-name">{post.author?.name}</div>
                <div className="post-meta-line">{timeAgo(post.created_at)}</div>
              </div>
            </div>
            <span className={`expiry-badge ${expiry.expired ? 'is-expired' : ''}`}>
              {expiry.label}
            </span>
          </div>

          <h1 className="post-detail-title">{post.title}</h1>

          {post.tags?.length > 0 && (
            <div className="tag-row">
              {post.tags.map((tag) => (
                <span key={tag.id} className="tag-chip">
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          <p className="post-detail-body">{post.body}</p>

          {post.is_owner && (
            <div className="post-detail-owner-actions">
              <Link to={`/posts/${post.id}/edit`} className="btn btn-ghost">
                Edit post
              </Link>
              <button type="button" className="btn btn-danger" onClick={handleDeletePost}>
                Delete post
              </button>
            </div>
          )}
        </article>

        <div className="comments-section">
          <h2>
            {comments.length} comment{comments.length === 1 ? '' : 's'}
          </h2>

          <form className="comment-form" onSubmit={handleAddComment}>
            <textarea
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              placeholder="Add a comment…"
              rows={3}
              maxLength={2000}
            />
            {commentError && <div className="error-text">{commentError}</div>}
            <button className="btn btn-primary btn-sm" type="submit" disabled={commentSubmitting}>
              {commentSubmitting ? 'Posting…' : 'Post comment'}
            </button>
          </form>

          <div className="comment-list">
            {comments.length === 0 ? (
              <div className="comment-empty">No comments yet — be the first to reply.</div>
            ) : (
              comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onUpdate={handleUpdateComment}
                  onDelete={handleDeleteComment}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}