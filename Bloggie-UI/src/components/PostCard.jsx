import { Link } from 'react-router-dom';
import { initials, timeAgo, expiryInfo } from '../utils/postTime';
import './PostCard.css';

function excerpt(body = '', maxLength = 220) {
  if (body.length <= maxLength) return body;
  return `${body.slice(0, maxLength).trim()}…`;
}

export default function PostCard({ post, onDelete }) {
  const expiry = expiryInfo(post.created_at);

  return (
    <article className={`post-card ${expiry.expired ? 'is-expired' : ''}`}>
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

      <Link to={`/posts/${post.id}`} className="post-title-link">
        <h2 className="post-title">{post.title}</h2>
      </Link>
      <p className="post-excerpt">{excerpt(post.body)}</p>

      {post.tags?.length > 0 && (
        <div className="tag-row">
          {post.tags.map((tag) => (
            <span key={tag.id} className="tag-chip">
              {tag.name}
            </span>
          ))}
        </div>
      )}

      <div className="post-card-foot">
        <Link to={`/posts/${post.id}`} className="comment-count">
          💬 {post.comments_count ?? 0} comment{post.comments_count === 1 ? '' : 's'}
        </Link>

        {post.is_owner && (
          <div className="post-owner-actions">
            <Link to={`/posts/${post.id}/edit`} className="btn-text">
              Edit
            </Link>
            <button
              type="button"
              className="btn-text btn-text-danger"
              onClick={() => onDelete(post.id)}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
}