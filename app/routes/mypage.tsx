import { DaprClient } from "@dapr/dapr";
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import MyImage from "~/components/my-image";

export let loader: LoaderFunction = async ({ request, context, params }) => {
    const daprClient = new DaprClient();
    const data = await daprClient.state.query('files', {

        filter: {
            "EQ": { "uploader": "user" }
        },
        page: {
            limit: 100
        },
        sort: []
    });
    const imageKeys = data.results.map((item: any) => item.key);
    return imageKeys;
};

export default function MyPage() {
    const imageKeys = useLoaderData<typeof loader>();
    return (
        <div>
            {(imageKeys as string[]).map((x) => (
                <MyImage imageid={x}></MyImage>
            ))}
        </div>
    );
}