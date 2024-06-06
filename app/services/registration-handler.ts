import { DaprClient } from "@dapr/dapr";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { bindingSmtpName, stateUsersName } from "~/types/constants";
import { User } from "~/types/user";
import { v4 as uuidv4 } from 'uuid';
import { createHash } from "crypto";

export async function registrationHandler({ request, }: ActionFunctionArgs) {
    try {
        const userId = uuidv4();
        const formData = await request.formData();
        // console.log('formData:', formData);
        const password = formData.get("password");
        // const displayName = formData.get("displayName");
        // console.log('password:', password);
        const passwordHash = createHash('sha256').update(password as string).digest('hex');
        const daprClient = new DaprClient();
        // const stateGetResult = await daprClient.state.get(stateUserStoreName, userId) as KeyValueType;
        // console.log('stateGetResult:', stateGetResult);
        const emailVerificationCode = uuidv4();
        const pendingEmail = formData.get("email") as string;
        const stateSaveResult = await daprClient.state.save(stateUsersName, [{
            key: userId,
            value: {
                displayName: formData.get("displayName"),
                passwordHash: passwordHash,
                pendingEmail: pendingEmail,
                emailVerified: false,
                email: undefined,
                emailVerificationCode: emailVerificationCode,
                emailVerificationCodeCreatedAt: new Date().getTime(),
                roles: []
            } as User
        }]);
        // stateGetResult.passwordHash = passwordHash;
        // const stateSaveResult = await daprClient.state.save(stateUserStoreName, [{ key: userId, value: stateGetResult as User }]);
        console.log('stateSaveResult:', stateSaveResult);
        // get the root url of the page
        const rootUrl = request.url.split('/register')[0];
        daprClient.binding.send(bindingSmtpName, 'create',
            `Please click on the following link to verify your email: ${rootUrl}/verify/${emailVerificationCode}`, {
            emailTo: pendingEmail,
            subject: "Verify your email address",
        })
        // Login succeeded, send them to the home page.
        return redirect("/usercreated");
        // return json({ ok: true });
    } catch (error) {
        console.error('error:', error);
        return redirect("/usercreationfailed");
    }
}