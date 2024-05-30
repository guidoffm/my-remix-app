import { LoaderFunction } from "@remix-run/node";
import { Outlet, json } from "@remix-run/react";
import { requireUserId } from "~/services/sessions";

export let loader: LoaderFunction = async ({ request }) => {
    await requireUserId(request);
  
    return json({});
  }
  
export default function Profile() {
    

    return (
        <div>
            <h1 className="h1">Profile</h1>
            <Outlet />
        </div>
    );
}