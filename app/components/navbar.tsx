import { Link, useLocation, useMatches } from "@remix-run/react";
import { useEffect, useState } from "react";
// import "../styles/navbar.css";

export default function Navbar({ displayName, userId, isAdmin }: { displayName: string | null, userId: string | null, isAdmin: boolean }) {
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
            <button className="hidden max-sm:block text-4xl" onClick={() => setIsOpen(!isOpen)}>
                ☰
            </button>
            <nav className={`bg-orange-200 w-10/12 mx-auto my-0 ${isOpen ? 'flex flex-col items-start' : 'max-sm:hidden'}`}>
                <ul className="sm:hidden list-none place-content-around p-0 md:flex xl:flex-row">
                    <li>
                        <div className="flex">
                            <div className="italic text-3xl items-center text-green-800"> {displayName ? `Hello ${displayName}` : ''}</div>
                        </div>
                    </li>
                    <li>
                        <Link to="/" className={`nav-link ${isActive('/') ? 'font-bold' : ''}`}>Home</Link>
                    </li>
                    {!userId &&
                        <li>
                            <Link to="/login" className={`nav-link ${isActive('/login') ? 'font-bold' : ''}`}>Login</Link>
                        </li>
                    }
                    {userId &&
                        <>
                            {/* <li>
                                <Link to="/foo" className={`nav-link ${isActive('/foo') ? 'active' : ''}`}>Foo</Link>
                            </li>
                            <li>
                                <Link to="/foo/bar" className={`nav-link ${isActive('/foo/bar') ? 'active' : ''}`}>Foo Bar</Link>
                            </li>
                            <li>
                                <Link to="/foo/baz" className={`nav-link ${isActive('/foo/baz') ? 'active' : ''}`}>Foo Baz</Link>
                            </li> */}
                            <li>
                                <Link to="/mypage" className={`nav-link ${isActive('/mypage') ? 'font-bold' : ''}`}>My Page</Link>
                            </li>
                            <li>
                                <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'font-bold' : ''}`}>Profile</Link>
                                <ul>
                                    <li>
                                        <Link to="/profile/username" className={`nav-link ${isActive('/profile/username') ? 'font-bold' : ''}`}>Username</Link>
                                    </li>
                                    <li>
                                        <Link to="/profile/password" className={`nav-link ${isActive('/profile/password') ? 'font-bold' : ''}`}>Password</Link>
                                    </li>
                                    <li>
                                        <Link to="/profile/email" className={`nav-link ${isActive('/profile/email') ? 'font-bold' : ''}`}>Email</Link>
                                    </li>
                                </ul>
                            </li>
                            {isAdmin && <li>
                                <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'font-bold' : ''}`}>Admin</Link>
                            </li>
                            }
                            <li>
                                <Link to="/logout" className={`nav-link ${isActive('/logout') ? 'font-bold' : ''}`}>Logout</Link>
                            </li>
                        </>
                    }

                    <li>
                        <Link to="/about" className={`nav-link ${isActive('/about') ? 'font-bold' : ''}`}>About</Link>
                    </li>

                </ul>
            </nav>
        </header>
    );
}