import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useCallback, useEffect, useState } from "react";
import CheckboxFromBoolean from "~/components/checkbox-from-boolean";
import DateFromNumber from "~/components/date-from-number";
import { UserWithKey } from "~/types/user";

export async function loader({ request,
    params,
}: LoaderFunctionArgs) {

    const { id } = params;
    if (!id) {
        return new Response("No user found", {
            status: 404,
        });
    }
    return id;
}

export default function AdminUser() {
    // console.log('Rendering component');

    const [user, setUser] = useState<UserWithKey | null>(null);
    const [refresh, setRefresh] = useState(false);
    // const [id, setId] = useState<string>('');
    const id = useLoaderData<typeof loader>();
    // setId(idParam);
    // console.log('id', id);

    const fetchUser = useCallback(async () => {
        // console.log('fetchUser', id);
        const fetchData = await fetch('/api/user?id=' + id);
        const userResult = await fetchData.json();
        // console.log('userResult', userResult);
        setUser(userResult); 
    }, [id]);
    
    useEffect(() => {
        // console.log('Running useEffect');
        // console.log('id', id);
        fetchUser();
        setRefresh(false);
    }, [refresh, id]);

    // console.log('user', user);
    const grantAdmin = async (grant: boolean) => {
        console.log('Button clicked!');
        console.log('user', user);
        await fetch('/api/user', {
            method: 'PATCH',
            body: JSON.stringify({
                id: id,
                roles: grant ? ['admin'] : []
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        // window.location.reload();
        setRefresh(true);
    };

    return (
        <div>
            {user && <>
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
            </>
            }
        </div>
    );
}