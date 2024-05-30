import { LoaderFunction, json } from "@remix-run/node";
import { Link, Outlet } from "@remix-run/react";
import { requireAdmin, requireUserId } from "~/services/sessions";

export let loader: LoaderFunction = async ({ request }) => {

    await requireUserId(request);
    await requireAdmin(request);
    return json({});
}
export default function Admin() {
    return (
        <div>
            <h2 className="h2">Admin</h2>
            <p>Welcome to the admin page.</p>
            <nav>
                <Link to="." className={`underline text-xl font-semibold m-2 text-blue-600`}>Home</Link>
                <Link to="users" className={`underline text-xl font-semibold m-2 text-blue-600`}>Users</Link>
            </nav>
            <Outlet />
        </div>
    );
}

