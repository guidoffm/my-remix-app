import { Form } from "@remix-run/react";
import { useState, useEffect } from "react";
import { registrationHandler } from "~/services/registration-handler";

export default function Register() {
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [email, setEmail] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [isSubmitDisabled, setSubmitDisabled] = useState(true);
    const [emailError, setEmailError] = useState('');
    const [displayNameError, setDisplayNameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordMatchError, setPasswordMatchError] = useState('');
    const [isUsernameTaken, setIsUsernameTaken] = useState(false);

    useEffect(() => {
        const res = password === '' || password2 === '' || passwordError !== '' ||
            passwordMatchError !== '' || email === '' || displayName === '' ||
            displayNameError !== '' || emailError !== '' || isUsernameTaken;
        setSubmitDisabled(res);
    }, [password, password2]);

    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
        } else {
            setEmailError('');
        }
    }, [email]);

    useEffect(() => {
        if (displayName.length < 8) {
            setDisplayNameError('Der Benutzername muss mindestens 8 Zeichen lang sein.');
        } else {
            setDisplayNameError('');
        }
    }, [displayName]);

    useEffect(() => {
        if (password.length < 8) {
            setPasswordError('Das Passwort muss mindestens 8 Zeichen lang sein.');
        } else {
            setPasswordError('');
        }
    }, [password]);

    useEffect(() => {
        if (password !== password2) {
            setPasswordMatchError('Die Passwörter stimmen nicht überein.');
        } else {
            setPasswordMatchError('');
        }
    }, [password, password2]);

    const setNewUsername1 = async (newName: string) => {
        setDisplayName(newName);
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

    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-8">Register as new user</h1>
            <div className="flex flex-col items-center justify-center bg-white p-8 rounded shadow-lg w-full max-w-xl">
                <Form method="post" className="w-full">
                    <label className="block">
                        Email:
                        <input
                            className="p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            autoFocus
                            type="email"
                            name="email"
                            required
                            onChange={e => setEmail(e.target.value)}
                        />
                        {emailError && <p className="text-red-500">{emailError}</p>}

                    </label>
                    <label className="block">
                        User Name:
                        <input
                            className="p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            type="text"
                            name="displayName"
                            required
                            onChange={e => setNewUsername1(e.target.value)}
                        />
                        {displayNameError && <p className="text-red-500">{displayNameError}</p>}
                        {isUsernameTaken && <p className="text-red-500">This username is already taken.</p>}
                    </label>
                    <label className="block">
                        Password:
                        <input
                            className="p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            type="password"
                            name="password"
                            required
                            onChange={e => setPassword(e.target.value)}
                        />
                        {passwordError && <p className="text-red-500">{passwordError}</p>}
                    </label>
                    <label className="block">
                        Password (repeat):
                        <input
                            className="p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            type="password"
                            name="password2"
                            required
                            onChange={e => setPassword2(e.target.value)}
                        />
                        {passwordMatchError && <p className="text-red-500">{passwordMatchError}</p>}
                    </label>
                    <button
                        type="submit"
                        className={`mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSubmitDisabled ? 'bg-gray-300' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
                        disabled={isSubmitDisabled}>Register</button>
                </Form>
            </div>
        </div>
    );
}

export const action = registrationHandler;