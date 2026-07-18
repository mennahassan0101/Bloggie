import { useState } from 'react';
import './TagInput.css';

export default function TagInput({ value = [], onChange, placeholder = 'Add a tag and press Enter' }) {
  const [draft, setDraft] = useState('');

  function commitDraft() {
    const cleaned = draft.trim();
    if (!cleaned) return;
    if (value.some((t) => t.toLowerCase() === cleaned.toLowerCase())) {
      setDraft('');
      return;
    }
    onChange([...value, cleaned]);
    setDraft('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commitDraft();
    } else if (e.key === 'Backspace' && draft === '' && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  function removeTag(tag) {
    onChange(value.filter((t) => t !== tag));
  }

  return (
    <div className="tag-input">
      <div className="tag-input-chips">
        {value.map((tag) => (
          <span key={tag} className="tag-chip tag-chip-removable">
            {tag}
            <button type="button" onClick={() => removeTag(tag)} aria-label={`Remove ${tag}`}>
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commitDraft}
          placeholder={value.length === 0 ? placeholder : ''}
        />
      </div>
    </div>
  );
}