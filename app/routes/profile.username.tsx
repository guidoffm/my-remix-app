import { Form } from "@remix-run/react";
import { useEffect, useState } from "react";
import { updateUsernameHandler } from "~/services/profile-handlers";

export default function ProfileUsername() {
    const [newUsername, setNewUsername] = useState('');
    const [p1Visible, setP1Visible] = useState(false);
    const [isUsernameTaken, setIsUsernameTaken] = useState(false);
    const [isSubmitDisabled, setSubmitDisabled] = useState(true);

    useEffect(() => {
        const p1 = newUsername.length < 8;
        setP1Visible(p1);
    }, [newUsername]);

    useEffect(() => {
        const res = isUsernameTaken || newUsername.length < 8;
        // console.log('res:', res);
        setSubmitDisabled(res);
    }, [newUsername, isUsernameTaken]);

    const setNewUsername1 = async (newName: string) => {
        setNewUsername(newName);
        const res = await fetch('/api/user', {
            method: 'POST',
            body: JSON.stringify({ newUsername: newName }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await res.json();
        console.log('data:', data);

        setIsUsernameTaken(data.exists);

        // const isUsernameTaken = data.some((item: any) => item.username === newUsername);
        // console.log('isUsernameTaken:', isUsernameTaken);
        // setIsUsernameTaken(isUsernameTaken);
    }

    return (
        <div className="w-full max-w-xl">
            <h2 className="h2">Update Username</h2>
            <Form method="post"
                className="bg-gray-200 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        New Username
                        <input
                            autoFocus
                            // id="password"
                            name="newUsername"
                            // defaultValue={user.displayName}
                            type="text"
                            // value={password}
                            onChange={e => setNewUsername1(e.target.value)}
                            // minLength={8}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username"
                        />
                    </label>
                    <p id="p1" className={`${p1Visible ? "visible" : "invisible"} text-red-500 text-xs italic`}>Please choose a new username (min. 8 chars).</p>
                    <p id="p2" className={`${isUsernameTaken ? "visible" : "invisible"} text-red-500 text-xs italic`}>This username is already taken.</p>

                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className={`${isSubmitDisabled ? "bg-gray-300" : "bg-blue-500 hover:bg-blue-700"} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                        disabled={isSubmitDisabled}
                    >Update Username</button>
                </div>
            </Form>
        </div>
    );
}

export const action = updateUsernameHandler;