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
            <h1>Users</h1>
            <div className="inner">
                <table>
                    <thead>
                        <tr>
                            <th scope="col">displayName</th>
                            <th scope="col">email</th>
                            <th scope="col">emailVerified</th>
                            <th scope="col">emailVerificationCode</th>
                            <th scope="col">emailVerificationCodeCreatedAt</th>
                            <th scope="col">pendingEmail</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(dataMyTable).map((user, index: number) => (
                            <tr key={index}>
                                <td><Link to={`/admin/user/${user.userId}`}>{user.displayName}</Link></td>
                                <td>{user.email}</td>
                                <td><CheckboxFromBoolean value={user.emailVerified} /></td>
                                <td>{user.emailVerificationCode}</td>
                                <td><DateFromNumber number={user.emailVerificationCodeCreatedAt} /></td>
                                <td>{user.pendingEmail}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}