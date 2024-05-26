import { Link, useLocation, useMatches } from "@remix-run/react";
import { useState, useEffect } from "react";

export default function Profile() {
    const location = useLocation();
    const matches = useMatches();
    const [activePath, setActivePath] = useState("");

    useEffect(() => {
        const activeMatch = matches.find(match => match.pathname === location.pathname);
        setActivePath(activeMatch ? activeMatch.pathname : "");
    }, [matches, location]);

    const isActive = (path: string) => {
        return path === activePath;
    };
    return (
        <div>
            <ul>
                <li>
                    <Link to="/profile/username" className={`nav-link ${isActive('/profile/username') ? 'active' : ''}`}>Username</Link>
                </li>
                <li>
                    <Link to="/profile/password" className={`nav-link ${isActive('/profile/password') ? 'active' : ''}`}>Password</Link>
                </li>
                <li>
                    <Link to="/profile/email" className={`nav-link ${isActive('/profile/email') ? 'active' : ''}`}>Email</Link>
                </li>
            </ul>
        </div>
    );
}