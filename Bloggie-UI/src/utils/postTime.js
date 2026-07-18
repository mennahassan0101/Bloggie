export function initials(name = '') {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ];
  for (const [name, secondsInUnit] of units) {
    const value = Math.floor(seconds / secondsInUnit);
    if (value >= 1) return `${value} ${name}${value > 1 ? 's' : ''} ago`;
  }
  return 'just now';
}

export function expiryInfo(createdAt) {
  const createdMs = new Date(createdAt).getTime();
  const expiresMs = createdMs + 24 * 60 * 60 * 1000;
  const msLeft = expiresMs - Date.now();

  if (msLeft <= 0) {
    return { expired: true, label: 'Expired' };
  }
  const hoursLeft = Math.floor(msLeft / (60 * 60 * 1000));
  const minutesLeft = Math.floor((msLeft % (60 * 60 * 1000)) / (60 * 1000));
  return {
    expired: false,
    label: hoursLeft >= 1 ? `${hoursLeft}h left` : `${minutesLeft}m left`,
  };
}