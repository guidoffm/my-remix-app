import { createCookieSessionStorage, redirect } from "@remix-run/node"; // or cloudflare/deno

type SessionData = {
  userId: string;
  displayName: string;
  roles: string[];
};

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

export async function getUserId(request: Request) {
  const session = await getSession(request.headers.get('Cookie'));
  return session.get('userId');
}

export async function requireUserId(
  request: Request,
) {
  const userId = await getUserId(request);
  if (!userId) {
    throw redirect('/login');
  }
  return userId;
}

export async function requireAdmin(
  request: Request,
) {
  const session = await getSession(request.headers.get('Cookie'));
  const roles = session.get('roles');
  if (!roles || !roles.includes('admin')) {
    throw redirect('/forbidden');
  }
}