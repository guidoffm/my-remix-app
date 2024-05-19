import { ActionFunctionArgs, LoaderFunction, json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

export let loader: LoaderFunction = async ({ request, context, params }) => {
    // console.log('request:', request);
    // const data = await fetchData(); // Ersetzen Sie dies durch Ihre eigene Logik zum Abrufen von Daten
    return { message: 'Hello World' };
};

export default function FooBar() {
    const data = useLoaderData<{ message: string }>();
    const user = { displayName: 'John Doe', email: 'john@doe.com' };

    return (
        <div>
            <h1>{data.message}</h1>

            <Form method="post" action="/foo/bar" style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', margin: '0 auto', fontFamily: 'sans-serif' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Settings for {user.displayName}</h1>

                <label style={{ marginBottom: '10px' }}>
                    Display Name
                    <input
                        name="displayName"
                        defaultValue={user.displayName}
                        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                    />
                </label>

                <label style={{ marginBottom: '10px' }}>
                    Email
                    <input
                        name="email"
                        defaultValue={user.email}
                        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                    />
                </label>

                <button type="submit" style={{ padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', cursor: 'pointer' }}>Save</button>
            </Form>
        </div>
    );
}

export async function action({
    request,
}: ActionFunctionArgs) {
    const formData = await request.formData();
    // console.log('formData:', formData);
    const email = formData.get("email");
    console.log('email:', email);
    const displayName = formData.get("displayName");
    console.log('displayName:', displayName);
    // const user = await getUser(request);

    // await updateUser(user.id, {
    //   email: formData.get("email"),
    //   displayName: formData.get("displayName"),
    // });

    return json({ ok: true });
}