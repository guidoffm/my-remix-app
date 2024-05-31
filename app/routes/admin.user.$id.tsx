import { DaprClient } from "@dapr/dapr";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate, useRevalidator } from "@remix-run/react";
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
    return { ...data as User, key: id } as unknown as UserWithKey;
}

export default function AdminUser() {
    const revalidator = useRevalidator();
    const navigate = useNavigate();
    const user = useLoaderData<typeof loader>();

    const grantAdmin = async (key: string, grant: boolean) => {
        console.log(`grantAdmin("${key}",${grant})`);
        await fetch('/api/user', {
            method: 'PATCH',
            body: JSON.stringify({
                id: key,
                roles: grant ? ['admin'] : []
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        revalidator.revalidate();
    };

    const deleteUser = async (key: string) => {
        if (confirm(`Are you sure you want to delete user "${user.displayName}"?`)) {
            console.log(`deleteUser("${key}")`);
            await fetch('/api/user', {
                method: 'DELETE',
                body: JSON.stringify({
                    id: key
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            // revalidator.revalidate();
            navigate('/admin/users');
        }
    };

    return (
        <div>
            <h2 className="h2">User "{user.displayName}"</h2>
            <table className="table border-collapse border border-black">
                <tbody>
                    <tr className="border border-black">
                        <th scope="row" className="text-left p-1 border border-black">displayName</th>
                        <td className="p-1">{user.displayName}</td>
                    </tr>
                    <tr className="border border-black">
                        <th scope="row" className="text-left p-1 border border-black">email</th>
                        <td className="p-1">{user.email}</td>
                    </tr>
                    <tr className="border border-black">
                        <th scope="row" className="text-left p-1 border border-black">emailVerified</th>
                        <td className="p-1"><CheckboxFromBoolean value={user.emailVerified} /></td>
                    </tr>
                    <tr className="border border-black">
                        <th scope="row" className="text-left p-1 border border-black">emailVerificationCode</th>
                        <td className="p-1">{user.emailVerificationCode}</td>
                    </tr>
                    <tr className="border border-black">
                        <th scope="row" className="text-left p-1 border border-black">emailVerificationCodeCreatedAt</th>
                        <td className="p-1"><DateFromNumber number={user.emailVerificationCodeCreatedAt} /></td>
                    </tr>
                    <tr className="border border-black">
                        <th scope="row" className="text-left p-1 border border-black">pendingEmail</th>
                        <td className="p-1">{user.pendingEmail}</td>
                    </tr>
                    <tr className="border border-black">
                        <th scope="row" className="text-left p-1 border border-black">is Admin</th>
                        <td className="p-1"><CheckboxFromBoolean value={user.roles && user.roles.includes('admin')} /></td>
                    </tr>
                </tbody>
            </table>
            <div>
                <button className="m-2 p-3 shadow rounded-lg bg-blue-500 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 font-medium" type="button" onClick={() => grantAdmin(user.key, true)}>Grant Admin role</button>
                <button className="m-2 p-3 shadow rounded-lg bg-yellow-500 text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50 font-medium" type="button" onClick={() => grantAdmin(user.key, false)}>Revoke Admin role</button>
                <button className="m-2 p-3 shadow rounded-lg bg-red-500 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50 font-medium" type="button" onClick={() => deleteUser(user.key)}>Delete User</button>
            </div>
        </div>
    );
}