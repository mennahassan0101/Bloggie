import { useState } from 'react';
import { initials, timeAgo } from '../utils/postTime';
import './CommentItem.css';

export default function CommentItem({ comment, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState(comment.body);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSave() {
    setError('');
    if (!body.trim()) {
      setError('Comment cannot be empty.');
      return;
    }
    setSubmitting(true);
    try {
      await onUpdate(comment.id, body.trim());
      setEditing(false);
    } catch (err) {
      setError('Could not save your changes. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleCancel() {
    setBody(comment.body);
    setError('');
    setEditing(false);
  }

  function handleDelete() {
    const confirmed = window.confirm('Delete this comment?');
    if (!confirmed) return;
    onDelete(comment.id);
  }

  return (
    <div className="comment-item">
      <div className="avatar" style={{ background: 'var(--pink)' }}>
        {comment.author?.image ? (
          <img src={comment.author.image} alt={comment.author.name} />
        ) : (
          initials(comment.author?.name)
        )}
      </div>
      <div className="comment-body-wrap">
        <div className="comment-head">
          <span className="comment-author-name">{comment.author?.name}</span>
          <span className="comment-time">{timeAgo(comment.created_at)}</span>
        </div>

        {editing ? (
          <div className="comment-edit-form">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
              maxLength={2000}
            />
            {error && <div className="error-text">{error}</div>}
            <div className="comment-edit-actions">
              <button type="button" className="btn-text" onClick={handleCancel}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleSave}
                disabled={submitting}
              >
                {submitting ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        ) : (
          <p className="comment-text">{comment.body}</p>
        )}

        {comment.is_owner && !editing && (
          <div className="comment-owner-actions">
            <button type="button" className="btn-text" onClick={() => setEditing(true)}>
              Edit
            </button>
            <button type="button" className="btn-text btn-text-danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}