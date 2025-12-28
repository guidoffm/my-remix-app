import { DaprClient } from "@dapr/dapr";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { bindingSmtpName, stateUsersName } from "~/types/constants";
import { User } from "~/types/user";
import { v4 as uuidv4 } from 'uuid';
import { createHash } from "crypto";

export async function registrationHandler({ request, }: ActionFunctionArgs) {
    try {
        // Create an id for the new user
        const userId = uuidv4();

        const formData = await request.formData();
        // console.log('formData:', formData);

        // get the password from the form
        const password = formData.get("password");
        // const displayName = formData.get("displayName");
        // console.log('password:', password);

        // compute the hash of the password
        const passwordHash = createHash('sha256').update(password as string).digest('hex');
        
        const daprClient = new DaprClient();

        // create a new email verification code
        const emailVerificationCode = uuidv4();

        const pendingEmail = formData.get("email") as string;

        console.log('Create user record for email: ', pendingEmail);

        // save the new user to the user state store
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
        
        console.log('stateSaveResult:', stateSaveResult);

        // get the root url of the page
        const rootUrl = request.url.split('/register')[0];

        const emailBody = `Please click on the following link to verify your email: ${rootUrl}/verify/${emailVerificationCode}`;

        console.log('emailBody:', emailBody);
        console.log('pendingEmail:', pendingEmail);
        // send the email with verification code to the user
        daprClient.binding.send(bindingSmtpName, 'create',
            emailBody, {
            emailTo: pendingEmail,
            subject: "Verify your email address",
        });

        // Registration succeeded, send them to the home page.
        return redirect("/usercreated");
  
    } catch (error) {
        console.error('error:', error);
        return redirect("/usercreationfailed");
    }
}