import { Link } from "@remix-run/react";
import { ProfileLinks } from "./profile-links";

export function NavLinks({ isAdmin, userId, renderDetails }: { isAdmin: boolean | undefined, userId: string | undefined, renderDetails: boolean }) {
    return (
        <>
            <li><Link to="/">Home</Link></li>
            {!userId &&
                <li><Link to="/login">Login</Link></li>
            }
            {userId &&
                <>
                    <li><Link to="/mypage">My Page</Link></li>
                    <li>
                        {renderDetails ?
                            <details>
                                <summary>Profile</summary>

                                <ProfileLinks />
                            </details> :
                            <>
                                <Link to={'/profile'}>Profile</Link>
                                <ProfileLinks />
                            </>

                        }
                    </li>
                    {isAdmin &&
                        <li><Link to="/admin">Admin</Link></li>
                    }
                    <li><Link to="/logout">Logout</Link></li>
                </>
            }

            <li><Link to="/about">About</Link></li>
        </>

    );
}