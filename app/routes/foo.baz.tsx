import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { getSession } from "~/services/sessions";

export let loader: LoaderFunction = async ({ request, context, params }) => {
    const cookies = request.headers.get('Cookie');
    const session = await getSession(cookies);
    const userId = session.get('userId');
    return json({ userId: userId });
};

export default function FooBaz() {
    const data = useLoaderData<{ userId: string }>();
    const [result, setResult] = useState('');

    const btnClick = async () => {
        console.log('btnClick');
        const myResponse = await fetch('/api/my');
        const myResult = await myResponse.json();
        setResult(myResult.foo);
    }

    return (
        <div>
            <h1>Hello {data.userId}</h1>
            <button type="button" onClick={btnClick}>Button</button>
            <div>{result}</div>
        </div>
    );
}

