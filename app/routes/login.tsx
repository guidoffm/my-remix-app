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
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form action="/login" method="post" className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-8 text-center">Please Sign In</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Username
                    </label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        autoFocus
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Sign in
                    </button>
                </div>
            </form>
        </div>
    );
}
