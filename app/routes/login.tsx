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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f0f0' }}>
            {error ? <div className="error">{error}</div> : null}
            <form action="/login" method="post" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
                <div>
                    <p>Please sign in</p>
                </div>
                <label style={{ display: 'flex', flexDirection: 'column' }}>
                    Username: <input 
                    type="text" 
                    name="username" 
                    autoFocus
                    style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column' }}>
                    Password:{" "}
                    <input type="password" name="password" style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                </label>
                <button type="submit" style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', backgroundColor: '#007BFF', color: '#fff', cursor: 'pointer' }}>Sign in</button>
            </form>
        </div>
    );
}
