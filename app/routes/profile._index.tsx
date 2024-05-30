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

            <Link to="/profile/username" className={`underline text-xl font-semibold m-2 text-blue-600`}>Username</Link>

            <Link to="/profile/password" className={`underline text-xl font-semibold m-2 text-blue-600`}>Password</Link>

            <Link to="/profile/email" className={`underline text-xl font-semibold m-2 text-blue-600`}>Email</Link>

        </div>
    );
}