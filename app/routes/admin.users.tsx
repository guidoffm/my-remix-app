import { DaprClient } from "@dapr/dapr";
import { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import CheckboxFromBoolean from "~/components/checkbox-from-boolean";
import DateFromNumber from "~/components/date-from-number";
import { getSession } from "~/services/sessions";
import { stateUserStoreName } from "~/types/constants";
import { User, UserWithKey } from "~/types/user";


export let loader: LoaderFunction = async ({ request, context, params }) => {
    const session = await getSession(
        request.headers.get("Cookie")
    );
    // console.log('userId', session.get("userId"));
    const daprClient = new DaprClient();
    const data = await daprClient.state.query(stateUserStoreName, {

        filter: {
            // EQ: {
            //     uploader: userId
            // }
        },
        page: {
            limit: 100
        },
        sort: []
    });
    const users = data.results.map((item) => {
        return {
            userId: item.key,
            displayName: (item.data as User).displayName,
            email: (item.data as User).email,
            emailVerified: (item.data as User).emailVerified,
            emailVerificationCode: (item.data as User).emailVerificationCode,
            emailVerificationCodeCreatedAt: (item.data as User).emailVerificationCodeCreatedAt,
            pendingEmail: (item.data as User).pendingEmail,
            roles: (item.data as User).roles,
        } as UserWithKey;
    });
    // console.log('users', users);
    // return users as { key: string; data: User; etag?: string | undefined; error?: string | undefined; }[];
    // return json(users);
    return users;
};

export default function AdminUsers() {
    const dataMyTable: UserWithKey[] = useLoaderData<typeof loader>();
    // console.log('dataMyTable', dataMyTable);
    return (
        <div className="outer">
            <h2 className="h2">Users</h2>
            <div className="inner">
                <table className="table border-collapse border-black border">
                    <thead className="border border-black">
                        <tr className="table-row">
                            <th scope="col" className="border border-black p-1">displayName</th>
                            <th scope="col" className="border border-black p-1">email</th>
                            <th scope="col" className="border border-black p-1">emailVerified</th>
                            <th scope="col" className="border border-black p-1">emailVerificationCode</th>
                            <th scope="col" className="border border-black p-1">emailVerificationCodeCreatedAt</th>
                            <th scope="col" className="border border-black p-1">pendingEmail</th>
                            <th scope="col" className="border border-black p-1">Admin</th>
                        </tr>
                    </thead>
                    <tbody className="border border-black">
                        {(dataMyTable).map((user, index: number) => (
                            <tr key={index} className="table-row">
                                <td className="border border-black p-1"><Link to={`/admin/user/${user.userId}`} className="underline font-semibold text-blue-600">{user.displayName}</Link></td>
                                <td className="border border-black p-1">{user.email}</td>
                                <td className="border border-black p-1 text-center"><CheckboxFromBoolean value={user.emailVerified} /></td>
                                <td className="border border-black p-1">{user.emailVerificationCode}</td>
                                <td className="border border-black p-1"><DateFromNumber number={user.emailVerificationCodeCreatedAt} /></td>
                                <td className="border border-black p-1">{user.pendingEmail}</td>
                                <td className="border border-black p-1 text-center"><CheckboxFromBoolean value={user.roles?.includes('admin')} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}