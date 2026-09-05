// Debug wrapper - intercept console.error
const origError = console.error;
console.error = function(...args) {
  origError.apply(console, args);
  const status = document.getElementById('status');
  if (status) {
    status.textContent = 'ERROR: ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ');
    status.className = 'status error';
  }
};
