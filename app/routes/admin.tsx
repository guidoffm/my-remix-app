import { DaprClient } from "@dapr/dapr";
import { LoaderFunction, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getSession } from "~/services/sessions";
import { stateUserStoreName } from "~/types/constants";
// import { User } from "~/types/user";

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
        } as UserWithKey;
    });
    // console.log('users', users);
    // return users as { key: string; data: User; etag?: string | undefined; error?: string | undefined; }[];
    // return json(users);
    return users;
};

export default function Admin() {
    const dataMyTable: UserWithKey[] = useLoaderData<typeof loader>();
    // console.log('dataMyTable', dataMyTable);
    return (
        <div className="outer">
            <h1>Admin</h1>
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
                        {(dataMyTable).map((item, index: number) => (
                            <tr key={index}>
                                <td><Link to={`/admin/user/${item.userId}`}>{item.displayName}</Link></td>
                                <td>{item.email}</td>
                                <td><input type="checkbox" checked={item.emailVerified} readOnly/></td>
                                <td>{item.emailVerificationCode}</td>
                                <td>{item.emailVerificationCodeCreatedAt}</td>
                                <td>{item.pendingEmail}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}