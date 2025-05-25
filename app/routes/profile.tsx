import { LoaderFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { requireUserId } from "~/services/sessions";

export const loader: LoaderFunction = async ({ request }) => {
    await requireUserId(request);
  
    return {};
  }
  
export default function Profile() {
    

    return (
        <div>
            <h1 className="h1">Profile</h1>
            <Outlet />
        </div>
    );
}