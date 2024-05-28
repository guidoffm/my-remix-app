import { DaprClient } from "@dapr/dapr";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import CheckboxFromBoolean from "~/components/checkbox-from-boolean";
import DateFromNumber from "~/components/date-from-number";
import { stateUserStoreName } from "~/types/constants";
import { User } from "~/types/user";

export async function loader({ request,
    params,
}: LoaderFunctionArgs) {
    const daprClient = new DaprClient();

    const { id } = params;
    if (!id) {
        return new Response("No user found", {
            status: 404,
        });
    }

    const data = await daprClient.state.get(stateUserStoreName, id);
    if (!data) {
        return new Response("No user found", {
            status: 404,
        });
    }
    console.log('data', data);
    return data;
}

export default function AdminUser() {
    const user: User = useLoaderData<typeof loader>();
    // console.log('user', user);
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
                        <td><CheckboxFromBoolean value={user.roles && user.roles.includes('admin')}/></td>
                    </tr>
                </tbody>
            </table>

        </div>
    );
}