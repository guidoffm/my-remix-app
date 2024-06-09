import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { getSession, destroySession } from "../services/sessions";

export const action = async ({
    request,
}: ActionFunctionArgs) => {
    const session = await getSession(
        request.headers.get("Cookie")
    );
    return redirect("/", {
        headers: {
            "Set-Cookie": await destroySession(session),
        },
    });
};

export default function LogoutRoute() {
    return (
        <>
            <p>Are you sure you want to log out?</p>
            <Form method="post">
                <button className="btn">Logout</button>
            </Form>
        </>
    );
}
