import { DaprClient } from "@dapr/dapr";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { getSession } from "~/services/sessions";
import { stateUserStoreName } from "~/types/constants";
import { User } from "~/types/user";
import { createHash } from "crypto";
import { useEffect, useState } from "react";

export default function ProfilePassword() {

    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

    // const handleSubmit = (event: Event) => {
    //     event.preventDefault();
    //     // Hier können Sie die Passwörter verarbeiten
    //     // ...

    //     // Setzen Sie die Passwörter zurück
    //     setPassword('');
    //     setPassword2('');
    // }
    useEffect(() => {
        const res = password === '' || password2 === '' || password.length < 8 || password !== password2;
        // console.log('res:', res);
        setIsSubmitDisabled(res);
    }, [password, password2]);

    return (
        <div>
            <h1>Password</h1>
            <Form method="post" style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', margin: '0 auto', fontFamily: 'sans-serif' }}>
                {/* <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Settings for {user.displayName}</h1> */}

                <label style={{ marginBottom: '10px' }}>
                    New Password
                    <input
                        id="password"
                        name="password"
                        // defaultValue={user.displayName}
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        // minLength={8}
                        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                    />
                </label>
                <label style={{ marginBottom: '10px' }}>
                    Repeat Password
                    <input
                        name="password2"
                        id="password2"
                        // defaultValue={user.displayName}
                        type="password"
                        value={password2}
                        onChange={e => setPassword2(e.target.value)}
                        // minLength={8}

                        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                    />
                </label>

                <button type="submit"
                    style={{
                        padding: '10px',
                        backgroundColor: isSubmitDisabled ? 'lightgrey' : 'blue',
                        color: 'white', border: 'none', cursor: 'pointer'
                    }}
                    disabled={isSubmitDisabled}>Update Password</button>
            </Form>
        </div>
    );
}

export async function action({ request, }: ActionFunctionArgs) {

    const cookies = request.headers.get('Cookie');
    const session = await getSession(cookies);
    const userId = session.get('userId');
    const displayName = session.get('displayName');

    if (!userId) {
        return json({ ok: false, message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    // console.log('formData:', formData);
    const password = formData.get("password");
    // console.log('password:', password);
    const passwordHash = createHash('sha256').update(password as string).digest('hex');
    const daprClient = new DaprClient();
    const stateSaveResult = await daprClient.state.save(stateUserStoreName, [{
        key: userId,
        value: {
            displayName: displayName,
            passwordHash: passwordHash,
        } as User
    }]);
    console.log('stateSaveResult:', stateSaveResult);

    return json({ ok: true });
}