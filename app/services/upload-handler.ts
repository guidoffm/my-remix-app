import { DaprClient } from "@dapr/dapr";
import { ActionFunctionArgs, json, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";
import { requireUserId } from "~/services/sessions";
import { bindingFilesStoreName } from "~/types/constants";
import { ImageState } from "~/types/image-state";
import { v4 as uuidv4 } from 'uuid';


export default async function uploadHandler({ request, }: ActionFunctionArgs) {

    const userId = await requireUserId(request);

    const uploadHandler = unstable_createMemoryUploadHandler({
        maxPartSize: 5000000,
    });
    const formData = await unstable_parseMultipartFormData(
        request,
        uploadHandler
    );

    const blob = formData.get("avatar") as File;
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const daprClient = new DaprClient();
    const obj = {
        key: uuidv4(),
        value: {
            fileName: blob.name,
            type: blob.type,
            uploader: userId,
            uploadTime: new Date().toISOString()
        } as ImageState
    };
    // console.log('key:', obj.key);
    const base64 = buffer.toString('base64');
    const sendBindingResult = await daprClient.binding.send(bindingFilesStoreName, 'create', base64, {
        "Content-Type": obj.value.type,
        key: obj.key
    });
    console.debug('sendBindingResult:', sendBindingResult);
    const saveStateResult = await daprClient.state.save('files', [obj]);
    console.log('saveStateResult:', saveStateResult);

    return json({ ok: true });
};
