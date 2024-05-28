import { DaprClient } from "@dapr/dapr";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useRevalidator } from "@remix-run/react";
import CheckboxFromBoolean from "~/components/checkbox-from-boolean";
import DateFromNumber from "~/components/date-from-number";
import { stateUserStoreName } from "~/types/constants";
import { User, UserWithKey } from "~/types/user";

export async function loader({ request,
    params,
}: LoaderFunctionArgs) {

    const { id } = params;
    if (!id) {
        return new Response("No user found", {
            status: 404,
        });
    }
    console.log('id:', id);
    const daprClient = new DaprClient();
    const data = await daprClient.state.get(stateUserStoreName, id);
    return { ...data as User, key: id } as UserWithKey;
}

export default function AdminUser() {
    const revalidator = useRevalidator();
    const user = useLoaderData<typeof loader>();

    const grantAdmin = async (grant: boolean) => {
        console.log('Button clicked!');
        console.log('user', user);
        await fetch('/api/user', {
            method: 'PATCH',
            body: JSON.stringify({
                id: user.key,
                roles: grant ? ['admin'] : []
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        revalidator.revalidate();
    };

    return (
        <div>
            <h1>User "{user.displayName}"</h1>
            <p>Welcome to the admin user page.</p>
            <table>
                <tbody>
                    <tr>
                        <th scope="row">displayName</th>
                        <td>{user.displayName}</td>
                    </tr>
                    <tr>
                        <th scope="row">email</th>
                        <td>{user.email}</td>
                    </tr>
                    <tr>
                        <th scope="row">emailVerified</th>
                        <td><CheckboxFromBoolean value={user.emailVerified} /></td>
                    </tr>
                    <tr>
                        <th scope="row">emailVerificationCode</th>
                        <td>{user.emailVerificationCode}</td>
                    </tr>
                    <tr>
                        <th scope="row">emailVerificationCodeCreatedAt</th>
                        <td><DateFromNumber number={user.emailVerificationCodeCreatedAt} /></td>
                    </tr>
                    <tr>
                        <th scope="row">pendingEmail</th>
                        <td>{user.pendingEmail}</td>
                    </tr>
                    <tr>
                        <th scope="row">is Admin</th>
                        <td><CheckboxFromBoolean value={user.roles && user.roles.includes('admin')} /></td>
                    </tr>
                </tbody>
            </table>
            <div>
                <button type="button" onClick={() => grantAdmin(true)}>Grant Admin role</button>
                <button type="button" onClick={() => grantAdmin(false)}>Revoke Admin role</button>
            </div>

        </div>
    );
}