import { Link } from "@remix-run/react";

export function ProfileLinks() {
    return (
        <ul className="p-2">
            <li><Link to={'/profile/username'}>Username</Link></li>
            <li><Link to={'/profile/password'}>Password</Link></li>
            <li><Link to={'/profile/email'}>Email</Link></li>
        </ul>
    );
}
