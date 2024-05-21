import { DaprClient } from "@dapr/dapr";
import { ActionFunctionArgs, json, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";
import { ImageState } from "~/types/image-state";
import {v4 as uuidv4} from 'uuid';

export let headers = {
  'Cache-Control': 'no-store'
}

export default function Upload() {
  
  return (
    <div>
      <h1>Upload</h1>
      <form action="/upload" method="post" encType="multipart/form-data">
        <input type="file" name="avatar" />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export const action = async ({
  request,
}: ActionFunctionArgs) => {
  const uploadHandler = unstable_createMemoryUploadHandler({
    maxPartSize: 500_000,
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
      buffer: buffer.toJSON(),
      fileName: blob.name,
      type: blob.type,
      uploader: 'user',
      uploadTime: new Date().toISOString()
    } as ImageState
  };
  // console.log(obj);
  const data = await daprClient.state.save('files', [obj]);
  console.log('data:', data);

  return json({ ok: true });
};