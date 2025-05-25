import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import stylesheet from "./styles/tailwind.css?url";
import { Navbar } from "./components/navbar";
import { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { getSession } from "./services/sessions";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const roles = session.get("roles");
  return {
    userId: session.get("userId"),
    displayName: session.get("displayName"),
    isAdmin: roles && roles.includes("admin"),
  };
}

export default function App() {
  const data = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="p-4 bg-[url('/background2.jpg')] bg-cover bg-center min-h-screen">
        <Navbar userId={data.userId} displayName={data.displayName} isAdmin={data.isAdmin} />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
