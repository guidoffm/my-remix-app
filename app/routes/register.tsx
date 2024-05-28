import { Form } from "@remix-run/react";
import "../styles/register.css"
import { useState, useEffect } from "react";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { DaprClient } from "@dapr/dapr";
import { stateUserStoreName } from "~/types/constants";
import { v4 as uuidv4 } from 'uuid';
import { createHash } from "crypto";
import { User } from "~/types/user";

export default function Register() {
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [email, setEmail] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [isSubmitDisabled, setSubmitDisabled] = useState(true);

    useEffect(() => {
        const res = password === '' || password2 === '' || password.length < 8 || password !== password2;
        setSubmitDisabled(res);
    }, [password, password2]);

    return (
        <div className="outer">
            <h1>Register as new user</h1>
            <div className="inner">
                <Form method="post">
                    <label>
                        Email:
                        <input
                            className="input"
                            autoFocus
                            type="email"
                            name="email"
                            required
                            onChange={e => setEmail(e.target.value)}
                        />
                    </label>
                    <label>
                        User Name:
                        <input
                            className="input"
                            type="text"
                            name="displayName"
                            required
                            onChange={e => setDisplayName(e.target.value)}
                        />
                    </label>
                    <label>
                        Password:
                        <input
                            className="input"
                            type="password"
                            name="password"
                            required
                            onChange={e => setPassword(e.target.value)}
                        />
                    </label>
                    <label>
                        Password (repeat):
                        <input
                            className="input"
                            type="password"
                            name="password2"
                            required
                            onChange={e => setPassword2(e.target.value)}
                        />
                    </label>
                    <button
                        type="submit"
                        style={{
                            backgroundColor: isSubmitDisabled ? 'lightgrey' : 'blue'
                        }}
                        disabled={isSubmitDisabled}>Register</button>
                </Form>
            </div>
        </div>
    );
}

export async function action({ request, }: ActionFunctionArgs) {

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
    const stateSaveResult = await daprClient.state.save(stateUserStoreName, [{
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
    daprClient.binding.send('smtp', 'create',
        `Please click on the following link to verify your email: ${rootUrl}/verify/${emailVerificationCode}`, {
        emailTo: pendingEmail,
        subject: "Verify your email address",
    })
    // Login succeeded, send them to the home page.
    // return redirect("/");
    return json({ ok: true });
}