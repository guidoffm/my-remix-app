import { NavLinks } from "./nav-links";

export function Navbar({ displayName, userId, isAdmin }: { displayName: string | undefined, userId: string | undefined, isAdmin: boolean | undefined }) {
    return (
        <nav className="navbar bg-base-200">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden text-2xl">☰</div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <NavLinks userId={userId} isAdmin={isAdmin} renderDetails={false} />
                    </ul>
                </div>
                <a className="btn btn-ghost text-xl">{displayName ? `Hello ${displayName}` : ''}</a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <NavLinks userId={userId} isAdmin={isAdmin} renderDetails={true} />
                </ul>
            </div>
            <div className="navbar-end">
                <a className="btn btn-info">Button</a>
            </div>
        </nav>
    );
}