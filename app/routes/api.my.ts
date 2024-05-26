import { LoaderFunctionArgs } from "@remix-run/node";
import my from "~/services/my.server";
import { getSession } from "~/sessions";

export async function loader({
    request, params,
}: LoaderFunctionArgs) {

    const cookies = request.headers.get('Cookie');
    console.log('Cookies:', cookies);
    const session = await getSession(cookies);
    const userId = session.get('userId');
    console.log('userId:', userId);
    if (!userId) {
        return new Response(JSON.stringify({error: 'Unauthorized'}), {
            status: 401,
            headers: {
                "Content-Type": 'application/json',
            },
        } as ResponseInit);
    }

    const myResult = await my();
    return new Response(JSON.stringify({foo: myResult}), {
        status: 200,
        headers: {
            "Content-Type": 'application/json',
        },
    } as ResponseInit);
}