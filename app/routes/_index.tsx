import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getSession } from "~/sessions";

export const meta: MetaFunction = () => {
  return [
    { title: "Guido's Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

// export let loader: LoaderFunction = async ({ request, context, params }) => {
//   const session = await getSession(
//     request.headers.get("Cookie")
//   );
//   console.log('userId', session.get("userId"));
//   return session.get("userId") || null;
// };

export default function Index() {
  // const userId = useLoaderData<typeof loader>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      {/* <h1>Hello {userId}</h1> */}
      {/* <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul> */}
    </div>
  );
}
