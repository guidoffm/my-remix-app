import { DaprClient } from "@dapr/dapr";
import { ActionFunctionArgs, LoaderFunction, json, redirect, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";
import { ImageState } from "~/types/image-state";
import { v4 as uuidv4 } from 'uuid';
import { bindingFilesStoreName } from "../types/constants";
import { getSession, requireUserId } from "~/services/sessions";
import '../styles/upload.css';

export let headers = {
  'Cache-Control': 'no-store'
}

export let loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);

  return json({});
}

export default function Upload() {

  return (
    <div className="upload-container">
      <h1 className="upload-header">Upload</h1>
      <form method="post" encType="multipart/form-data" className="upload-form">
        <input type="file" name="avatar" className="upload-input" />
        <button type="submit" className="upload-button">Upload</button>
      </form>
    </div>
  );
}

export const action = async ({ request, }: ActionFunctionArgs) => {
  
  const userId = await requireUserId(request);

  const uploadHandler = unstable_createMemoryUploadHandler({
    maxPartSize: 5_000_000,
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