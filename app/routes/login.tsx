import type {
    ActionFunctionArgs,
    LoaderFunctionArgs,
} from "@remix-run/node"; // or cloudflare/deno
import { json, redirect } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";

import { getSession, commitSession } from "../services/sessions";
import { validateCredentials } from "../services/validate-credentials";

export async function loader({ request, }: LoaderFunctionArgs) {
    const session = await getSession(
        request.headers.get("Cookie")
    );
    // console.log('session', session);
    // console.log('userId', session.get("userId"));

    if (session.has("userId") && session.get("userId") !== null) {
        // Redirect to the home page if they are already signed in.
        return redirect("/");
    }

    const data = { error: session.get("error") };

    return json(data, {
        headers: {
            "Set-Cookie": await commitSession(session),
        },
    });
}

export async function action({ request, }: ActionFunctionArgs) {
    const session = await getSession(
        request.headers.get("Cookie")
    );
    const form = await request.formData();
    const username = form.get("username");
    const password = form.get("password");

    const user = await validateCredentials(
        username,
        password
    );

    // return json({ userId });


    if (!user) {
        session.flash("error", "Invalid username/password");

        // Redirect back to the login page with errors.
        return redirect("/login", {
            headers: {
                "Set-Cookie": await commitSession(session),
            },
        });
    }
    // console.log('user', user);
    session.set("userId", user.key);
    session.set("displayName", user.data.displayName);
    session.set("roles", user.data.roles);

    // Login succeeded, send them to the home page.
    return redirect("/", {
        headers: {
            "Set-Cookie": await commitSession(session),
        },
    });
}

export default function Login() {
    const { error } = useLoaderData<typeof loader>();

    return (
        <div className="flex justify-center items-center h-screen">
            {error ? <div className="error">{error}</div> : null}
            <form action="/login" method="post" className="flex flex-col w-1/3 bg-orange-100 mt-6">
                <div className="p-4">
                    <p className="font-bold">Please sign in</p>
                </div>
                <label className="p-4">
                    Username: <input
                        type="text"
                        name="username"
                        autoFocus className="m-4 input input-bordered input-primary w-full max-w-xs" />

                </label>
                <label className="p-4">
                    Password:
                    <input
                        type="password"
                        name="password"
                        className="m-4 input input-bordered input-primary w-full max-w-xs" />
                </label>
                <div className="p-4">
                    <button type="submit" className="btn btn-primary w-full">Sign in</button>
                </div>

            </form>
        </div>
    );
}
