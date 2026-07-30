/**
 * Extends app.json.
 *
 * Exists only to inject a base URL for the web export. GitHub Pages serves a
 * project site under /<repo>/ rather than at a domain root, so the exported
 * bundle needs to know that prefix or every asset request 404s.
 *
 * Driven by an env var so local development is untouched — with PAGES_BASE_URL
 * unset, this is a passthrough of app.json.
 */
module.exports = ({ config }) => ({
  ...config,
  experiments: {
    ...config.experiments,
    ...(process.env.PAGES_BASE_URL ? { baseUrl: process.env.PAGES_BASE_URL } : {}),
  },
});
