import { DaprClient } from "@dapr/dapr";
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import MyImage from "~/components/my-image";
import UploadForm from "~/components/upload-form";
import { requireUserId } from "~/services/sessions";
import uploadHandler from "~/services/upload-handler";
import { stateFilesStoreName } from "~/types/constants";

export let loader: LoaderFunction = async ({ request, context, params }) => {

    const userId = await requireUserId(request);

    const daprClient = new DaprClient();
    const data = await daprClient.state.query(stateFilesStoreName, {

        filter: {
            EQ: {
                uploader: userId
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
    const [imagesAvailable, setImagesAvailable] = useState(false);
    useEffect(() => {
        if (imageKeys.length > 0) {
            setImagesAvailable(true);
        }
    }, [imageKeys]);
    return (
        <div>
            <h1 className="h1">My Images</h1>
           
            <h2 className="h2">Upload new Image</h2>
            <UploadForm />
            
            <h2 className="h2">Uploaded Images</h2>
            {imagesAvailable &&
                <div className={"flex flex-wrap: wrap"}>
                    {(imageKeys as string[]).map((x) => (
                        <MyImage key={x} imageid={x}></MyImage>
                    ))}
                </div>
            }
            {!imagesAvailable &&
                <div>
                    <p>No images uploaded yet.</p>
                </div>
            }
        </div>
    );
}

export const action = uploadHandler;