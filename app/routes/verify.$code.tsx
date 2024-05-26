import { DaprClient } from "@dapr/dapr";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { stateUserStoreName } from "~/types/constants";
import { User } from "~/types/user";


export async function loader({ request,
    params,
}: LoaderFunctionArgs) {
    const daprClient = new DaprClient();

    const { code } = params;
    const data = await daprClient.state.query(stateUserStoreName, {
        filter: {
            EQ: { emailVerificationCode: code }
        },
        page: {
            limit: 1
        },
        sort: []
    });

    if (data.results.length === 0) {
        return new Response("Invalid code", {
            status: 400,
        });
    }

    const queryResult = data.results[0];
    const userId = queryResult.key;
    const user = queryResult.data as User;

    // check if the code is expired
    if (user.emailVerificationCodeCreatedAt && user.emailVerificationCodeCreatedAt + 1000 * 3600 < Date.now()) {
        await daprClient.state.delete(stateUserStoreName, userId);
        return new Response("Code expired", {
            status: 400,
        });
    }

    // update the user
    user.emailVerified = true;
    user.email = user.pendingEmail;
    user.pendingEmail = undefined;
    user.emailVerificationCode = undefined;
    user.emailVerificationCodeCreatedAt = undefined;

    await daprClient.state.save(stateUserStoreName, [{
        key: userId,
        value: user
    }]);

    return new Response("Email verified", {
        status: 200,
    });
}

export default function Verify() {
    const data = useLoaderData<typeof loader>();
    return (
        <div className="outer">
            <h1>Your email has been verified.</h1>
            <p>You can now <Link to="/login">login</Link>to your account.</p>
        </div>
    );
}