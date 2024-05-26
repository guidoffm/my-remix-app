import { Form } from "@remix-run/react";
import "../styles/register.css"
import { useState, useEffect } from "react";

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
                <Form>
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