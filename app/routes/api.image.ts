import { DaprClient } from "@dapr/dapr";
import { ActionFunctionArgs } from "@remix-run/node";
import { getUserId } from "~/services/sessions";
import { bindingFilesName, stateFilesName } from "~/types/constants";

export async function action({ request, params }: ActionFunctionArgs) {
    const userId = getUserId(request);

    if (!userId) {
        return new Response('Forbidden', { status: 403 });
    }
    if (request.method === 'DELETE') {
        const daprClient = new DaprClient();
        const body = await request.json();
        const imageid = body.id;
        try {
            const bindingDeleteResult = await daprClient.binding.send(bindingFilesName, 'delete', undefined, { key: imageid });
            console.log('bindingDeleteResult:', bindingDeleteResult);
        } catch (error) {
            console.log('error:', error);
        }
        try {
            const stateDeleteResult = await daprClient.state.delete(stateFilesName, imageid);
            console.log('stateDeleteResult:', stateDeleteResult);
        } catch (error) {
            console.log('error:', error);
        }
        return new Response('Deleted', { status: 204 });
    }
    return new Response('Method not allowed', { status: 405 });
}
