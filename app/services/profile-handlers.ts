import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { destroySession, getSession, requireUserId } from "./sessions";
import { DaprClient } from "@dapr/dapr";
import { KeyValueType } from "@dapr/dapr/types/KeyValue.type";
import { stateUsersName } from "~/types/constants";
import { User } from "~/types/user";
import { createHash } from "crypto";

/**
 * Handles the update of a user's username.
 *
 * This function performs the following steps:
 * 1. Requires the user ID from the request.
 * 2. Retrieves the session from the request cookies.
 * 3. Extracts the new username from the form data.
 * 4. Throws an error if no new username is provided.
 * 5. Retrieves the current user state from Dapr.
 * 6. Updates the user's display name in the state.
 * 7. Saves the updated state back to Dapr.
 * 8. Updates the session with the new display name.
 * 9. Redirects to the "/username-updated" page with the updated session.
 *
 * @param {ActionFunctionArgs} args - The arguments containing the request object.
 * @returns {Promise<Response>} A promise that resolves to a redirect response.
 * @throws {Error} If no new username is provided.
 */
export async function updateUsernameHandler({ request, }: ActionFunctionArgs): Promise<Response> {
    const userId = await requireUserId(request);
    const session = await getSession(request.headers.get('Cookie'));
    const formData = await request.formData();
    // console.log('formData:', formData);
    const newUsername = formData.get('newUsername') as string;
    if (!newUsername) {
        throw new Error('No new username provided');
    }
    const daprClient = new DaprClient();

    // Retrieve the user record from Dapr
    const stateGetResult = await daprClient.state.get(stateUsersName, userId) as KeyValueType;
    // console.log('stateGetResult:', stateGetResult);
    
    // Update the display name in the user state
    stateGetResult.displayName = newUsername;

    // Save the updated user record back to Dapr
    const stateSaveResult = await daprClient.state.save(stateUsersName, [{ key: userId, value: stateGetResult as User }]);
    console.log('stateSaveResult:', stateSaveResult);
    
    // Update the session with the new display name
    session.set('displayName', newUsername);

    // Save the session to the response cookies
    return redirect('/username-updated', {
        headers: {
            'Set-Cookie': await destroySession(session),
        },
    });
}

/**
 * Handles the update of a user's password.
 *
 * This function retrieves the user ID from the request, extracts the new password from the form data,
 * hashes the password, and updates the user's password hash in the state store.
 *
 * @param {ActionFunctionArgs} args - The arguments containing the request object.
 * @returns {Promise<Response>} A promise that resolves to a redirect response to the home page.
 *
 * @throws {Error} If there is an issue with retrieving the user ID, form data, or updating the state store.
 */
export async function updatePasswordHandler({ request, }: ActionFunctionArgs): Promise<Response> {
    const userId = await requireUserId(request);

    const formData = await request.formData();
    // console.log('formData:', formData);
    const password = formData.get('password');
    // console.log('password:', password);
    const passwordHash = createHash('sha256').update(password as string).digest('hex');
    
    const daprClient = new DaprClient();

    // Retrieve the user record from Dapr
    const user = await daprClient.state.get(stateUsersName, userId) as KeyValueType;

    // Update the password hash in the user state
    user.passwordHash = passwordHash;

    // Save the updated user record back to Dapr
    const stateSaveResult = await daprClient.state.save(stateUsersName, [{ key: userId, value: user as User }]);
    console.log('stateSaveResult:', stateSaveResult);

    // Login succeeded, send them to the home page.
    return redirect('/');
    // return json({ ok: true });
}