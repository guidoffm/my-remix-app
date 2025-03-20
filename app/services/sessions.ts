import { createCookieSessionStorage, redirect } from "@remix-run/node"; // or cloudflare/deno

/**
 * Represents the data stored in a user session.
 * 
 * @typedef {Object} SessionData
 * @property {string} userId - The unique identifier for the user.
 * @property {string} displayName - The display name of the user.
 * @property {string[]} roles - An array of roles assigned to the user.
 */
type SessionData = {
  userId: string;
  displayName: string;
  roles: string[];
};

/**
 * Represents the data structure for session flash messages.
 * 
 * @property {string} error - The error message to be flashed in the session.
 */
type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>(
    {
      // a Cookie from `createCookie` or the CookieOptions to create one
      cookie: {
        name: "__session",
        secrets: ['your secret key'],

        // // all of these are optional
        // domain: "remix.run",
        // // Expires can also be set (although maxAge overrides it when used in combination).
        // // Note that this method is NOT recommended as `new Date` creates only one date on each server deployment, not a dynamic date in the future!
        // //
        // // expires: new Date(Date.now() + 60_000),
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
        sameSite: "strict",
        secure: true,
      },
    }
  );

export { getSession, commitSession, destroySession };

/**
 * Retrieves the user ID from the session cookie in the request.
 *
 * @param {Request} request - The HTTP request object containing the session cookie.
 * @returns {Promise<string | undefined>} A promise that resolves to the user ID if it exists in the session, or undefined if it does not.
 */
export async function getUserId(request: Request) {
  const session = await getSession(request.headers.get('Cookie'));
  return session.get('userId');
}

/**
 * Requires a user ID to be present in the request. If the user ID is not found,
 * the function will redirect the user to the login page.
 *
 * @param {Request} request - The request object from which to extract the user ID.
 * @returns {Promise<string>} - A promise that resolves to the user ID if found.
 * @throws {Response} - Throws a redirect response to the login page if the user ID is not found.
 */
export async function requireUserId(
  request: Request,
): Promise<string> {
  const userId = await getUserId(request);
  if (!userId) {
    throw redirect('/login');
  }
  return userId;
}

/**
 * Ensures that the user has an 'admin' role. If the user does not have the 'admin' role,
 * they are redirected to the '/forbidden' page.
 *
 * @param {Request} request - The HTTP request object containing the user's session cookie.
 * @throws {Response} Redirects to the '/forbidden' page if the user does not have the 'admin' role.
 * @returns {Promise<void>} A promise that resolves if the user has the 'admin' role.
 */
export async function requireAdmin(
  request: Request,
): Promise<void> {
  const session = await getSession(request.headers.get('Cookie'));
  const roles = session.get('roles');
  if (!roles || !roles.includes('admin')) {
    throw redirect('/forbidden');
  }
}