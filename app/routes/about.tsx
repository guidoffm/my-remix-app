import { Await, defer, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";

export async function loader() {

    const promise1 = new Promise<string>((resolve) => {
        setTimeout(() => {
            resolve('First');
        }, 1000);
    });
    const promise2 = new Promise<string>((resolve) => {
        setTimeout(() => {
            resolve('Second');
        }, 2000);
    });
    const promise3 = new Promise<string>((resolve) => {
        setTimeout(() => {
            resolve('Third');
        }, 3000);
    });

    return defer({ promise1, promise2, promise3 });
}

export default function About() {
    const { promise1, promise2, promise3 } = useLoaderData<typeof loader>();
    return (
        <div>
            <h1 className="h1">About</h1>
            <ul>
                <Suspense fallback={<li>Loading...</li>}>
                    <Await resolve={promise1}>
                        {(data) => <li>{data}</li>}
                    </Await>
                </Suspense>
                <Suspense fallback={<li>Loading...</li>}>
                    <Await resolve={promise2}>
                        {(data) => <li>{data}</li>}
                    </Await>
                </Suspense>
                <Suspense fallback={<li>Loading...</li>}>
                    <Await resolve={promise3}>
                        {(data) => <li>{data}</li>}
                    </Await>
                </Suspense>
            </ul>
        </div>
    );
}