/**
 * Levels of log that is used application-wide.
 * @enum {string}
 */
const LogLevel = Object.freeze({
  DEBUG: 'debug',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical',
});

module.exports = {
  LogLevel,
};