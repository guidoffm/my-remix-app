import { Outlet } from "@remix-run/react";

export default function Profile() {
    

    return (
        <div>
            <h1>Profile</h1>
            <Outlet />
        </div>
    );
}