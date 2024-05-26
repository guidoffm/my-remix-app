import { LoaderFunctionArgs } from "@remix-run/node";
import my from "~/services/my.server";

export async function loader({
    params,
}: LoaderFunctionArgs) {

    const myResult = await my();
    return new Response(JSON.stringify({foo: myResult}), {
        status: 200,
        headers: {
            "Content-Type": 'application/json',
        },
    } as ResponseInit);
}