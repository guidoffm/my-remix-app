import { Link, useLocation, useMatches } from "@remix-run/react";
import { useEffect, useState } from "react";

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
            <nav className={`bg-orange-200 w-10/12 mx-auto my-0 p-2 ${isOpen ? 'flex flex-col items-start' : 'max-sm:hidden'}`}>
                <ul className="sm:hidden list-none place-content-around p-0 md:flex xl:flex-row">
                    <li>
                        <div className="flex">
                            <div className="italic text-3xl items-center text-green-800"> {displayName ? `Hello ${displayName}` : ''}</div>
                        </div>
                    </li>
                    <li>
                        <Link to="/" className={` hover:text-gray-800 ${isActive('/') ? 'font-bold text-black' : 'text-gray-500'}`}>Home</Link>
                    </li>
                    {!userId &&
                        <li>
                            <Link to="/login" className={`hover:text-gray-800 ${isActive('/login') ? 'font-bold text-black' : 'text-gray-500'}`}>Login</Link>
                        </li>
                    }
                    {userId &&
                        <>
                            {/* <li>
                                <Link to="/foo" className={`hover:text-gray-800 ${isActive('/foo') ? 'active' : ''}`}>Foo</Link>
                            </li>
                            <li>
                                <Link to="/foo/bar" className={`hover:text-gray-800 ${isActive('/foo/bar') ? 'active' : ''}`}>Foo Bar</Link>
                            </li>
                            <li>
                                <Link to="/foo/baz" className={`hover:text-gray-800 ${isActive('/foo/baz') ? 'active' : ''}`}>Foo Baz</Link>
                            </li> */}
                            <li>
                                <Link to="/mypage" className={`hover:text-gray-800 ${isActive('/mypage') ? 'font-bold text-black' : 'text-gray-500'}`}>My Page</Link>
                            </li>
                            <li>
                                <Link to="/profile" className={`hover:text-gray-800 ${isActive('/profile') ? 'font-bold text-black' : 'text-gray-500'}`}>Profile</Link>
                                {/* <ul>
                                    <li>
                                        <Link to="/profile/username" className={`hover:text-gray-800 ${isActive('/profile/username') ? 'font-bold text-black' : 'text-gray-500'}`}>Username</Link>
                                    </li>
                                    <li>
                                        <Link to="/profile/password" className={`hover:text-gray-800 ${isActive('/profile/password') ? 'font-bold text-black' : 'text-gray-500'}`}>Password</Link>
                                    </li>
                                    <li>
                                        <Link to="/profile/email" className={`hover:text-gray-800 ${isActive('/profile/email') ? 'font-bold text-black' : 'text-gray-500'}`}>Email</Link>
                                    </li>
                                </ul> */}
                            </li>
                            {isAdmin && <li>
                                <Link to="/admin" className={`hover:text-gray-800 ${isActive('/admin') ? 'font-bold text-black' : 'text-gray-500'}`}>Admin</Link>
                            </li>
                            }
                            <li>
                                <Link to="/logout" className={`hover:text-gray-800 ${isActive('/logout') ? 'font-bold text-black' : 'text-gray-500'}`}>Logout</Link>
                            </li>
                        </>
                    }

                    <li>
                        <Link to="/about" className={`hover:text-gray-800 ${isActive('/about') ? 'font-bold text-black' : 'text-gray-500'}`}>About</Link>
                    </li>

                </ul>
            </nav>
        </header>
    );
}