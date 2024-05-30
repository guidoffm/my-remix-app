import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import stylesheet from "./styles/tailwind.css?url";
import "./styles/root.css";
import Navbar from "./components/navbar";
import { LinksFunction, LoaderFunction, json } from "@remix-run/node";
import { getSession } from "./services/sessions";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export let loader: LoaderFunction = async ({ request, context, params }) => {
  const session = await getSession(
    request.headers.get("Cookie")
  );
  // console.log('userId', session.get("userId"));
  const roles = session.get("roles");
  return json({
    userId: session.get("userId"),
    displayName: session.get("displayName"),
    isAdmin: roles && roles.includes("admin"),
  });
};

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>();

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
          <Navbar userId={data.userId} displayName={data.displayName} isAdmin={data.isAdmin} />
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
