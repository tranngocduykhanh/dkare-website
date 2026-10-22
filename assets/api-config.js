/* Set to the actual HTTPS API origin only after deploying the backend. */
window.REVOX_API_BASE = '';
if (['localhost', '127.0.0.1'].includes(location.hostname)) {
  window.REVOX_API_BASE = location.port === '8787' ? location.origin : 'http://' + location.hostname + ':8787';
}
