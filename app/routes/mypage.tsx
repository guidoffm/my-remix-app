import { DaprClient } from "@dapr/dapr";
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import MyImage from "~/components/my-image";
import { stateFilesStoreName } from "~/types/constants";

export let loader: LoaderFunction = async ({ request, context, params }) => {
    const daprClient = new DaprClient();
    const data = await daprClient.state.query(stateFilesStoreName, {

        filter: {
            EQ: {
                uploader: 'user'
            }
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
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {(imageKeys as string[]).map((x) => (
                <MyImage key={x} imageid={x}></MyImage>
            ))}
        </div>
    );
}