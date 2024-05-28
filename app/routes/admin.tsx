import { Link, Outlet } from "@remix-run/react";

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

