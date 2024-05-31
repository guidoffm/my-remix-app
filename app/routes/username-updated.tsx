import { Link } from "@remix-run/react";

export default function UsernameUpdated() {
    return (
        <div className="p-2">
            <h1 className="h1">Username Updated</h1>
            <p className="font-bold m-2">
                Congratulations! Your username has been updated.
            </p>
            <p className="m-2">
                You have been logged out. Please log back in with your new username.
            </p>
            <p className="m-2">
                Please <Link to="/login" className="font-bold text-2xl"> login </Link>again!
            </p>
        </div>
    );
}