// import { LoaderFunction } from "@remix-run/node";
import { useState } from "react";

// export let loader: LoaderFunction = async ({ request, context, params }) => {

//     return { message: 'Hello World' };
// };

export default function FooBaz() {

    const [result, setResult] = useState('');

    const btnClick = async () => {
        console.log('btnClick');
        const myResponse = await fetch('/api/my');
        const myResult = await myResponse.json();
        setResult(myResult.foo);
    }

    return (
        <div>
            <h1>Hello World</h1>
            <button type="button" onClick={btnClick}>Button</button>
            <div>{result}</div>
        </div>
    );
}

