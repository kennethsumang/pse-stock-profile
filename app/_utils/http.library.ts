/**
 * Retrieves the current domain.
 * @returns {string} The current domain including protocol (http/https) and hostname.
 */
export const getCurrentDomain = (): string => {
  const port = window.location.port;
  if (!port) {
    return `${window.location.protocol}//${window.location.hostname}`;
  }

  return `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
}