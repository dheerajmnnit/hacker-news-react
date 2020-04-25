export const getTime = (dateStr) => {
  const diff = Date.now() - Date.parse(dateStr);
  const sec = diff / 1000;
  const min = sec / 60;
  const hrs = min / 60;
  const days = hrs / 24;
  const months = days / 30;
  const yrs = months / 12;
  if (sec < 60) {
    return `${Math.ceil(sec)} seconds ago`;
  }
  if (min < 60) {
    return `${Math.ceil(min)} minutes ago`;
  }
  if (hrs < 24) {
    return `${Math.ceil(hrs)} hours ago`;
  }
  if (days < 30) {
    return `${Math.ceil(days)} days ago`;
  }
  if (months < 12) {
    return `${Math.ceil(months)} months ago`;
  }
  return `${Math.ceil(yrs)} years ago`;
};

export const getQueryStringValue = (key) => {
  if (window && window.location && window.location.search) {
    const regex = new RegExp(`^(?:.*[&\\?]${encodeURIComponent(key).replace(/[.+*]/g, '\\$&')}(?:\\=([^&]*))?)?.*$`, 'i');
    return decodeURIComponent(window.location.search.replace(regex, '$1'));
  }
  return null;
};
