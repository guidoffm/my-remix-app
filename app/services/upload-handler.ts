import { DaprClient } from "@dapr/dapr";
import { requireUserId } from "~/services/sessions";
import { bindingFilesName } from "~/types/constants";
import { ImageState } from "~/types/image-state";
import { v4 as uuidv4 } from 'uuid';
import { ActionFunctionArgs, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";

export function getUploadHandler({ fileFieldName, maxPartSize }: { fileFieldName: string, maxPartSize: number }) {

    const uploadHandler = async ({ request, params, context }: ActionFunctionArgs) => {

        const userId = await requireUserId(request);

        const uploadHandler = unstable_createMemoryUploadHandler({
            maxPartSize: maxPartSize,
        });
        const formData = await unstable_parseMultipartFormData(
            request,
            uploadHandler
        );

        const blob = formData.get(fileFieldName) as File;
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
        const sendBindingResult = await daprClient.binding.send(bindingFilesName, 'create', base64, {
            "Content-Type": obj.value.type,
            key: obj.key
        });
        console.debug('sendBindingResult:', sendBindingResult);
        const saveStateResult = await daprClient.state.save('files', [obj]);
        console.log('saveStateResult:', saveStateResult);

        return Response.json({ ok: true });
    }
    return uploadHandler;
}