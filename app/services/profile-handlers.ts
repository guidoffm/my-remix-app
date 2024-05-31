import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { destroySession, getSession, requireUserId } from "./sessions";
import { DaprClient } from "@dapr/dapr";
import { KeyValueType } from "@dapr/dapr/types/KeyValue.type";
import { stateUserStoreName } from "~/types/constants";
import { User } from "~/types/user";
import { createHash } from "crypto";

export async function updateUsernameHandler({ request, }: ActionFunctionArgs) {
    const userId = await requireUserId(request);
    const session = await getSession(request.headers.get('Cookie'));
    const formData = await request.formData();
    // console.log('formData:', formData);
    const newUsername = formData.get('newUsername') as string;
    if (!newUsername) {
        throw new Error('No new username provided');
    }
    const daprClient = new DaprClient();
    const stateGetResult = await daprClient.state.get(stateUserStoreName, userId) as KeyValueType;
    // console.log('stateGetResult:', stateGetResult);
    stateGetResult.displayName = newUsername;
    const stateSaveResult = await daprClient.state.save(stateUserStoreName, [{ key: userId, value: stateGetResult as User }]);
    console.log('stateSaveResult:', stateSaveResult);
    session.set('displayName', newUsername);
    return redirect("/username-updated", {
        headers: {
            "Set-Cookie": await destroySession(session),
        },
    });
}

export async function updatePasswordHandler({ request, }: ActionFunctionArgs) {
    const userId = await requireUserId(request);

    const formData = await request.formData();
    // console.log('formData:', formData);
    const password = formData.get('password');
    // console.log('password:', password);
    const passwordHash = createHash('sha256').update(password as string).digest('hex');
    const daprClient = new DaprClient();
    const stateGetResult = await daprClient.state.get(stateUserStoreName, userId) as KeyValueType;
    // console.log('stateGetResult:', stateGetResult);
    // const stateSaveResult = await daprClient.state.save(stateUserStoreName, [{
    //     key: userId,
    //     value: {
    //         displayName: displayName,
    //         passwordHash: passwordHash,
    //     } as User
    // }]);
    stateGetResult.passwordHash = passwordHash;
    const stateSaveResult = await daprClient.state.save(stateUserStoreName, [{ key: userId, value: stateGetResult as User }]);
    console.log('stateSaveResult:', stateSaveResult);

    // Login succeeded, send them to the home page.
    return redirect("/");
    // return json({ ok: true });
}