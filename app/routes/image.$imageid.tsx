import { DaprClient } from "@dapr/dapr";
import { LoaderFunctionArgs } from "@remix-run/node";
import { bindingFilesStoreName } from "~/types/constants";
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

    const getResult = await daprClient.binding.send(bindingFilesStoreName, 'get', undefined, { key: imageid });
    const decodedBuffer = Buffer.from(getResult as unknown as string, 'base64');
    return new Response(decodedBuffer, {
        status: 200,
        headers: {
            "Content-Type": stateGetResult.type,
        },
    } as ResponseInit);
}
