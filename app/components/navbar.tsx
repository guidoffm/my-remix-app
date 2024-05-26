import { Link, useLocation, useMatches } from "@remix-run/react";
import { useEffect, useState } from "react";
import "../styles/navbar.css";

export default function Navbar({ userId }: { userId: string | null }) {
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
                        {userId ? `Hello ${userId}` : 'Please Login!'}
                    </li>
                    <li>
                        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
                    </li>
                    {!userId &&
                        <li>
                            <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`}>Login</Link>
                        </li>
                    }
                    {userId &&
                        <>
                            <li>
                                <Link to="/foo" className={`nav-link ${isActive('/foo') ? 'active' : ''}`}>Foo</Link>
                            </li>
                            <li>
                                <Link to="/foo/bar" className={`nav-link ${isActive('/foo/bar') ? 'active' : ''}`}>Foo Bar</Link>
                            </li>
                            <li>
                                <Link to="/foo/baz" className={`nav-link ${isActive('/foo/baz') ? 'active' : ''}`}>Foo Baz</Link>
                            </li>
                            <li>
                                <Link to="/mypage" className={`nav-link ${isActive('/mypage') ? 'active' : ''}`}>My Page</Link>
                            </li>
                            <li>
                                <Link to="/upload" className={`nav-link ${isActive('/upload') ? 'active' : ''}`}>Upload</Link>
                            </li>
                            <li>
                                <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`}>Profile</Link>
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
                            </li>
                            <li>
                                <Link to="/logout" className={`nav-link ${isActive('/logout') ? 'active' : ''}`}>Logout</Link>
                            </li>
                        </>
                    }

                    <li>
                        <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>About</Link>
                    </li>

                </ul>
            </nav>
        </header>
    );
}