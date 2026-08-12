/**
 * Public site constants.
 *
 * These are committed rather than read from `.env` on purpose. `.env` is
 * gitignored, so anything that lives only there is missing when GitHub Actions
 * builds the site — the build would quietly fall back to a placeholder and
 * publish a dead mailto: link. Values here are visible on the page anyway, so
 * there is nothing to protect by hiding them.
 *
 * Never put an API key or anything secret in this file. A static build inlines
 * it straight into the published HTML.
 */

/** Where "email me" links point. Shown in the footer as visible text. */
export const CONTACT_EMAIL = 'hannagonjohn@gmail.com';

/**
 * Where the beta signup form posts. Left in `.env` because it genuinely varies
 * between local testing and production, and an unset value degrades to a
 * mailto: link rather than breaking.
 */
export const SIGNUP_ENDPOINT = import.meta.env.PUBLIC_SIGNUP_ENDPOINT ?? '';
