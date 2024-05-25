import { createHash } from "crypto";

export function validateCredentials(username: FormDataEntryValue | null, password: FormDataEntryValue | null) {
    // Implement your logic to validate the credentials here
    // For example, you can check if the username and password match a user in your database
    // Return the userId if the credentials are valid, otherwise return null
    const passwordHash = createHash('sha256').update(password as string).digest('hex');
    // console.log('passwordHash', passwordHash);
    // echo -n '6sg,78sufgr'| shasum -a 256 -b
    if (username === "admin" && passwordHash === "dc5b242a597a39651f22931828cfddeb49c3971e764225a9e31dbed88615b657") {
        return Promise.resolve("123456");
    } else {
        return Promise.resolve(null);
    }
}
