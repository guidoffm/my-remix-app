import { DaprClient } from "@dapr/dapr";
import { createHash } from "crypto";
import { stateUserStoreName } from "~/types/constants";
import { User } from "~/types/user";

export async function validateCredentials(username: FormDataEntryValue | null, password: FormDataEntryValue | null): Promise<{ key: string; data: User; etag?: string | undefined; error?: string | undefined; } | null> {
    const daprClient = new DaprClient();
    // Implement your logic to validate the credentials here
    // For example, you can check if the username and password match a user in your database
    // Return the userId if the credentials are valid, otherwise return null
    const passwordHash = createHash('sha256').update(password as string).digest('hex');
    // console.log('passwordHash', passwordHash);
    // echo -n '6sg,78sufgr'| shasum -a 256 -b
    // await daprClient.state.save(stateUserStoreName, [{
    //     key: '1715C4B2-F0A7-4EC1-92CB-66CE9C73EEF3',
    //     value: {
    //         displayName: "admin",
    //         passwordHash: "dc5b242a597a39651f22931828cfddeb49c3971e764225a9e31dbed88615b657",
    //     } as User
    // }]);
    const data = await daprClient.state.query(stateUserStoreName, {
        filter: {
            AND: [{
                EQ: { displayName: username }
            }, {
                EQ: { passwordHash: passwordHash }
            }]
        },
        page: {
            limit: 1
        },
        sort: []
    });

    if (data.results.length === 0) {
        return null;
    }

    return data.results[0];
    // if (username === "admin" && passwordHash === "dc5b242a597a39651f22931828cfddeb49c3971e764225a9e31dbed88615b657") {
    //     return Promise.resolve("123456");
    // } else {
    //     return Promise.resolve(null);
    // }
}
