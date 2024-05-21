import { DaprClient } from "@dapr/dapr";
import { LoaderFunctionArgs } from "@remix-run/node";
import { ImageState } from "~/types/image-state";

export async function loader({
    params,
}: LoaderFunctionArgs) {

    const daprClient = new DaprClient();
    
    const { imageid } = params;

    if (!imageid) {
        return new Response("No image found", {
            status: 404,
        });
    }
    const stateGetResult = await daprClient.state.get('files', imageid) as ImageState;

    if (!stateGetResult) {
        return new Response("No image found", {
            status: 404,
        });
    }

    const buffer2 = Buffer.from(stateGetResult.buffer.data);
    return new Response(buffer2, {
        status: 200,
        headers: {
            "Content-Type": stateGetResult.type,
        },
    } as ResponseInit);
}
