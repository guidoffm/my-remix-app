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
    const [viewMode, setViewMode] = useState('gallery');

    const handleGalleryView = () => {
        setViewMode('gallery');
    };

    const handleListView = () => {
        setViewMode('list');
    };

    useEffect(() => {
        if (imageKeys.length > 0) {
            setImagesAvailable(true);
        }
    }, [imageKeys]);

    const handleDelete = (imageKey: string) => {
        console.log(`Deleting image ${imageKey}`);
    };

    return (
        <div>
            <h1 className="h1">My Images</h1>

            <h2 className="h2">Upload new Image</h2>
            <UploadForm />

            <h2 className="h2">Uploaded Images</h2>
            <div>
                <button className={`m-2 p-2 rounded-lg ${viewMode === 'gallery' ? 'bg-blue-500 text-white' : ''}`} onClick={handleGalleryView}>As Gallery</button>
                <button className={`m-2 p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-500 text-white' : ''}`} onClick={handleListView}>As List</button>
            </div>
            {imagesAvailable && viewMode === 'gallery' &&
                <div className={"grid grid-cols-8 gap-4"}>
                    {(imageKeys as string[]).map((x) => (
                        // <MyImage key={x} imageid={x} className="h-50"></MyImage>
                        <a href={`/image/${x}`} target="_blank">
                            <img src={`/image/${x}`} alt={`image-${x}`} className="w-40 h-40" />
                        </a>
                    ))}
                </div>
            }
            {imagesAvailable && viewMode === 'list' &&
                <div>
                    <table className="border border-black">
                        <tbody>
                            {(imageKeys as string[]).map((x) => (
                                <tr key={x} className="border border-black">
                                    <td className="p-4 border border-black w-44">
                                        <img src={`/image/${x}`} alt={`image-${x}`} className={"w-40 h-40"} />
                                    </td>
                                    <td className="p-4 border border-black">
                                        <button onClick={() => handleDelete(x)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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