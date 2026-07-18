import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import TagInput from '../components/TagInput';
import './PostForm.css';

export default function PostForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState([]);
  const [originalTags, setOriginalTags] = useState([]);

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [blockedReason, setBlockedReason] = useState('');

  useEffect(() => {
    if (!isEditMode) return;

    let cancelled = false;
    async function loadPost() {
      setLoading(true);
      try {
        const { data } = await api.get(`/posts/${id}`);
        const post = data.data;
        if (cancelled) return;

        if (!post.is_owner) {
          setBlockedReason('You can only edit your own posts.');
          return;
        }

        setTitle(post.title);
        setBody(post.body);
        const tagNames = (post.tags || []).map((t) => t.name);
        setTags(tagNames);
        setOriginalTags(tagNames);
      } catch (err) {
        if (!cancelled) {
          setBlockedReason(
            err.response?.status === 404 ? 'Post not found.' : 'Could not load this post.'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadPost();
    return () => {
      cancelled = true;
    };
  }, [id, isEditMode]);

  function fieldError(name) {
    return fieldErrors[name]?.[0];
  }

  function tagsError() {
    const messages = Object.keys(fieldErrors)
      .filter((key) => key === 'tags' || key.startsWith('tags.'))
      .flatMap((key) => fieldErrors[key]);
    return messages[0];
  }

  function tagsChanged() {
    if (tags.length !== originalTags.length) return true;
    const a = [...tags].sort();
    const b = [...originalTags].sort();
    return a.some((t, i) => t !== b[i]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    setFieldErrors({});

    if (tags.length === 0) {
      setFieldErrors({ tags: ['A post must have at least one tag.'] });
      return;
    }

    setSubmitting(true);
    try {
      if (isEditMode) {
        await api.put(`/posts/${id}`, { title, body });
        if (tagsChanged()) {
          await api.put(`/posts/${id}/tags`, { tags });
        }
      } else {
        await api.post('/posts', { title, body, tags });
      }
      navigate('/');
    } catch (err) {
      if (err.response?.status === 422) {
        setFieldErrors(err.response.data.errors || {});
      } else if (err.response?.status === 403) {
        setFormError("You don't have permission to do that.");
      } else {
        setFormError('Something went wrong. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (isEditMode && loading) {
    return (
      <div>
        <Navbar />
        <div className="post-form-page">
          <div className="post-form-state">Loading post…</div>
        </div>
      </div>
    );
  }

  if (blockedReason) {
    return (
      <div>
        <Navbar />
        <div className="post-form-page">
          <div className="post-form-card">
            <div className="banner-error">{blockedReason}</div>
            <Link to="/" className="btn-text">
              ← Back to feed
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="post-form-page">
        <div className="post-form-card">
          <h1>{isEditMode ? 'Edit post' : 'Write a new post'}</h1>
          <div className="sub">
            {isEditMode
              ? 'Update your title, body, or tags.'
              : 'Share something — every post needs at least one tag.'}
          </div>

          {formError && <div className="banner-error">{formError}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="pf-title">Title</label>
              <input
                id="pf-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give it a title"
                required
              />
              {fieldError('title') && <div className="error-text">{fieldError('title')}</div>}
            </div>

            <div className="field">
              <label htmlFor="pf-body">Body</label>
              <textarea
                id="pf-body"
                rows={10}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your post…"
                required
              />
              {fieldError('body') && <div className="error-text">{fieldError('body')}</div>}
            </div>

            <div className="field">
              <label htmlFor="pf-tags">Tags</label>
              <TagInput value={tags} onChange={setTags} />
              {tagsError() && <div className="error-text">{tagsError()}</div>}
            </div>

            <div className="post-form-actions">
              <Link to="/" className="btn btn-ghost">
                Cancel
              </Link>
              <button className="btn btn-primary" type="submit" disabled={submitting}>
                {submitting ? 'Saving…' : isEditMode ? 'Save changes' : 'Publish post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}