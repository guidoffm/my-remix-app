import { DaprClient } from "@dapr/dapr";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { requireUserId } from "~/services/sessions";
import { stateUserStoreName } from "~/types/constants";
import { User } from "~/types/user";
import { createHash } from "crypto";
import { useEffect, useState } from "react";
import { KeyValueType } from "@dapr/dapr/types/KeyValue.type";
import { updatePasswordHandler } from "~/services/profile-handlers";

export default function ProfilePassword() {

    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [isSubmitDisabled, setSubmitDisabled] = useState(true);
    const [p1Visible, setP1Visible] = useState(false);
    const [p2Visible, setP2Visible] = useState(false);

    useEffect(() => {
        const p1 = password.length < 8;
        setP1Visible(p1);
    }, [password]);

    useEffect(() => {
        const p2 = (password !== '' || password2 !== '') && (password !== password2);
        setP2Visible(p2);
    }, [password, password2]);

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
        setSubmitDisabled(res);
    }, [password, password2]);

    return (
        <div className="w-full max-w-xl">
            <h2 className="h2">Update Password</h2>
            <Form method="post"
                className="bg-gray-200 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        New Password
                        <input
                            autoFocus
                            // id="password"
                            name="password"
                            // defaultValue={user.displayName}
                            type="password"
                            // value={password}
                            onChange={e => setPassword(e.target.value)}
                            // minLength={8}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username"
                        />
                    </label>
                    <p id="p1" className={`${p1Visible ? "visible" : "invisible"} text-red-500 text-xs italic`}>Please choose a password (min. 8 chars).</p>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Repeat Password
                        <input
                            name="password2"
                            // id="password2"
                            // defaultValue={user.displayName}
                            type="password"
                            // value={password2}
                            onChange={e => setPassword2(e.target.value)}
                            // minLength={8}

                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username"
                        />
                    </label>
                    <p id="p2" className={`${p2Visible ? "visible" : "invisible"} text-red-500 text-xs italic`}>Passwords do not match.</p>

                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className={`${isSubmitDisabled ? "bg-gray-300" : "bg-blue-500 hover:bg-blue-700"} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                        disabled={isSubmitDisabled}
                    >Update Password</button>
                </div>
            </Form>
        </div>
    );
}

export const action=updatePasswordHandler;