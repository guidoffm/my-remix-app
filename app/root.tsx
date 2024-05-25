import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import "./styles/root.css";
import Navbar from "./components/navbar";
import { LoaderFunction } from "@remix-run/node";
import { getSession } from "./sessions";

export let loader: LoaderFunction = async ({ request, context, params }) => {
  const session = await getSession(
    request.headers.get("Cookie")
  );
  // console.log('userId', session.get("userId"));
  return session.get("userId") || null;
};

export function Layout({ children }: { children: React.ReactNode }) {
  const userId = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div>
          <Navbar userId={userId} />
        </div>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
