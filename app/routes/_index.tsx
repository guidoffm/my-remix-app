import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import MyComp from "~/components/my-comp";
import { getSession } from "~/services/sessions";

// export const meta: MetaFunction = () => {
//   return [
//     { title: "Guido's Remix App" },
//     { name: "description", content: "Welcome to Remix!" },
//   ];
// };

export let loader: LoaderFunction = async ({ request, context, params }): Promise<string | null> => {
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
      <h1 className="h1">Guido's Website</h1>
      {displayName &&
        <div>
          <MyComp displayName={displayName} />
        </div>
      }
      {!displayName &&
        <div>
          <p className="mt-4 mb-4 font-normal lg:text-3xl md:text-2xl sm:text-xl text-gray-700">Welcome to my website. Please <Link className="font-extrabold underline" to="/login">log in</Link> to see more.</p>
          <p className="mt-4 mb-4 font-normal lg:text-3xl md:text-2xl sm:text-xl text-gray-700">If you do not have an account yet, please <Link className="font-extrabold underline" to="/register">register</Link>!</p>
        </div>
      }

    </div>
  );
}
