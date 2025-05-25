import { DaprClient } from "@dapr/dapr";
import { requireUserId } from "~/services/sessions";
import { bindingFilesName, stateFilesName } from "~/types/constants";
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
        
        const metaData = {
            key: uuidv4(),
            value: {
                fileName: blob.name,
                type: blob.type,
                uploader: userId,
                uploadTime: new Date().toISOString()
            } as ImageState
        };
        
        // convert the buffer to base64
        const base64 = buffer.toString('base64');

        // send the binding to the binding component (Minio/S3)
        const sendBindingResult = await daprClient.binding.send(bindingFilesName, 'create', base64, {
            "Content-Type": metaData.value.type,
            key: metaData.key
        });
        console.debug('sendBindingResult:', sendBindingResult);

        // save the metadata to the state store
        const saveStateResult = await daprClient.state.save(stateFilesName, [metaData]);
        console.log('saveStateResult:', saveStateResult);

        return { ok: true };
    }
    return uploadHandler;
}