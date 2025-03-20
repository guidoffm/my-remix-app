import { DaprClient } from "@dapr/dapr";
import { KeyValueType } from "@dapr/dapr/types/KeyValue.type";
import { ActionFunctionArgs } from "@remix-run/node";
import { getUserId } from "~/services/sessions";
import { bindingFilesName, stateFilesName, stateUsersName } from "~/types/constants";
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
    
    const userId = getUserId(request);
    
    if (!userId) {
        return new Response('Forbidden', { status: 403 });
    }
    
    if (request.method === 'PATCH') {
        const daprClient = new DaprClient();
        const body = await request.json();
        const userId = body.id;
        const roles = body.roles;
        const stateGetResult = await daprClient.state.get(stateUsersName, userId) as KeyValueType;
        // console.log('stateGetResult:', stateGetResult);
        stateGetResult.roles = roles;
        // stateGetResult.passwordHash = passwordHash;
        const stateSaveResult = await daprClient.state.save(stateUsersName, [{ key: userId, value: stateGetResult as User }]);
        // console.log('stateSaveResult:', stateSaveResult);
        return Response.json({}, { status: 204 });
    }

    if (request.method === 'DELETE') {
        const daprClient = new DaprClient();
        const body = await request.json();
        const userId = body.id;

        const data = await daprClient.state.query(stateFilesName, {

            filter: {
                EQ: {
                    uploader: userId
                }
            },
            page: {
                limit: 100
            },
            sort: []
        });

        const ids = data.results.map((item) => {
            return item.key;
        });

        console.log('ids:', ids);

        for (const imageid of ids) {
            // try {
            //     const getResult = await daprClient.binding.send(bindingFilesStoreName, 'get', undefined, { key: imageid });
            //     console.log('getResult:', (getResult as unknown as string).length);
            // } catch (error) {
            //     console.log('error:', error);
            // }
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
        }

        try {
            const stateDeleteResult = await daprClient.state.delete(stateUsersName, userId);
            console.log('stateDeleteResult:', stateDeleteResult);
        } catch (error) {
            console.log('error:', error);
        }
        return Response.json({}, { status: 204 });
    }

    if (request.method === 'POST') {
        const daprClient = new DaprClient();
        const body = await request.json();
        const newUsername = body.newUsername;
        const data = await daprClient.state.query(stateUsersName, {

            filter: {
                EQ: {
                    displayName: newUsername
                }
            },
            page: {
                limit: 100
            },
            sort: []
        });
        return Response.json({ exists: data.results.length > 0 });
    }
    return Response.json({}, { status: 400 });
}