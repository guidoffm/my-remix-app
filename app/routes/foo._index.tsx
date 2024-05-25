import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import MyComp from "~/components/my-comp";
import { getSession } from "~/sessions";

export let loader: LoaderFunction = async ({ request, context, params }) => {
    const session = await getSession(
      request.headers.get("Cookie")
    );
    // console.log('userId', session.get("userId"));
    return session.get("userId") || null;
  };
  
export default function FooIndex() {

    const userId = useLoaderData<typeof loader>();
    return (
        <div>
            <h1>Foo</h1>
            <MyComp givenName={userId} surName={"Doe"} />
        </div>
    );
}