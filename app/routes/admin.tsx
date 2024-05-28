import { LoaderFunction, json, redirect } from "@remix-run/node";
import { Link, Outlet } from "@remix-run/react";
import { getSession } from "~/services/sessions";

export let loader: LoaderFunction = async ({ request, context, params }) => {
    const cookies = request.headers.get('Cookie');
    const session = await getSession(cookies);
    const userId = session.get('userId');

    if (!userId) {
        return redirect('/login');
    }

    const roles = session.get('roles');
    console.log('roles', roles);

    if (!roles || !roles.includes('admin')) {
       return redirect('/forbidden');
    }

    return json({ ok: true });
}
export default function Admin() {
    return (
        <div>
            <h1>Admin</h1>
            <p>Welcome to the admin page.</p>
            <nav>
                <ul>
                    <li><Link to=".">Home</Link></li>
                    <li><Link to="users">Users</Link></li>
                </ul>
            </nav>
            <Outlet />
        </div>
    );
}

