import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import MyComp from "~/components/my-comp";
import { getSession } from "~/services/sessions";

export const meta: MetaFunction = () => {
  return [
    { title: "Guido's Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export let loader: LoaderFunction = async ({ request, context, params }) => {
  const session = await getSession(
    request.headers.get("Cookie")
  );
  // console.log('userId', session.get("userId"));
  return session.get("displayName") || null;
};

export default function Index() {
  const displayName = useLoaderData<typeof loader>();
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Guido's Website</h1>
      {displayName &&
        <div>
          <MyComp displayName={displayName} />
        </div>
      }
      {!displayName &&
        <div>
          <p>Welcome to my website. Please <Link to="/login">log in</Link> to see more.</p>
          <p>If you do not have an account yet, please <Link to="/register">register</Link>!</p>
        </div>
      }
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
