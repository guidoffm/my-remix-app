import { Link } from "@remix-run/react";

export default function Profile() {

    return (
        <div>

            <Link to="/profile/username" className={`underline text-xl font-semibold m-2 text-blue-600`}>Username</Link>

            <Link to="/profile/password" className={`underline text-xl font-semibold m-2 text-blue-600`}>Password</Link>

            <Link to="/profile/email" className={`underline text-xl font-semibold m-2 text-blue-600`}>Email</Link>

        </div>
    );
}