import { Link, useLocation, useMatches } from "@remix-run/react";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
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
        <header className="header">
            <button className="burger" onClick={() => setIsOpen(!isOpen)}>
                ☰
            </button>
            <nav className={`nav ${isOpen ? 'open' : ''}`}>
                <ul className="nav-list">
                    <li>
                        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
                    </li>
                    <li>
                        <Link to="/foo" className={`nav-link ${isActive('/foo') ? 'active' : ''}`}>Foo</Link>
                    </li>
                    <li>
                        <Link to="/upload" className={`nav-link ${isActive('/upload') ? 'active' : ''}`}>Upload</Link>
                    </li>
                    <li>
                        <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>About</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}