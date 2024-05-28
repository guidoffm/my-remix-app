import { DaprClient } from "@dapr/dapr";
import { KeyValueType } from "@dapr/dapr/types/KeyValue.type";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { stateUserStoreName } from "~/types/constants";
import { User } from "~/types/user";

// export async function loader({
//     request, params,
// }: LoaderFunctionArgs) {
//     const id = request.url.split('?')[1].split('=')[1];
//     // console.log('id:', id);
//     if (!id) {
//         return new Response("No user found", {
//             status: 404,
//         });
//     }
//     const daprClient = new DaprClient();
//     const data = await daprClient.state.get(stateUserStoreName, id);
//     return new Response(JSON.stringify(data), {
//         status: 200,
//         headers: {
//             "Content-Type": 'application/json',
//         },
//     } as ResponseInit);

// }

export async function action({ request, params }: ActionFunctionArgs) {
    if (request.method === 'PATCH') {
        const daprClient = new DaprClient();
        const body = await request.json();
        const userId = body.id;
        const roles = body.roles;
        const stateGetResult = await daprClient.state.get(stateUserStoreName, userId) as KeyValueType;
        // console.log('stateGetResult:', stateGetResult);
        stateGetResult.roles = roles;
        // stateGetResult.passwordHash = passwordHash;
        const stateSaveResult = await daprClient.state.save(stateUserStoreName, [{ key: userId, value: stateGetResult as User }]);
        // console.log('stateSaveResult:', stateSaveResult);
        return json({}, { status: 204 });
    }
    return json({}, { status: 400 });
}