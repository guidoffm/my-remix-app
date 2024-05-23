import { DaprClient } from "@dapr/dapr";
import { ActionFunctionArgs, json, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";
import { ImageState } from "~/types/image-state";
import { v4 as uuidv4 } from 'uuid';
import { bindingFilesStoreName } from "../types/constants";

export let headers = {
  'Cache-Control': 'no-store'
}

export default function Upload() {

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f8f8f8' }}>
      <h1 style={{ marginBottom: '50px' }}>Upload</h1>
      <form action="/upload" method="post" encType="multipart/form-data" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '20px', borderRadius: '10px', backgroundColor: '#fff', boxShadow: '0px 0px 10px rgba(0,0,0,0.1)' }}>
        <input type="file" name="avatar" style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
        <button type="submit" style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: '#007BFF', color: '#fff', cursor: 'pointer' }}>Upload</button>
      </form>
    </div>
  );
}

export const action = async ({ request, }: ActionFunctionArgs) => {
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
      // buffer: buffer.toJSON(),
      fileName: blob.name,
      type: blob.type,
      uploader: 'user',
      uploadTime: new Date().toISOString()
    } as ImageState
  };
  console.log('key:', obj.key);
  const base64 = buffer.toString('base64');
  const createResult = await daprClient.binding.send(bindingFilesStoreName, 'create', base64, {
    "Content-Type": obj.value.type,
    key: obj.key
  });
  console.log('createResult:', createResult);
  // const getResult = await daprClient.binding.send('minio', 'get', undefined, { key: obj.key });
  // const decodedBuffer = Buffer.from(getResult as unknown as string, 'base64');
  // console.log('decodedBuffer:', decodedBuffer.length);
  const saveResult = await daprClient.state.save('files', [obj]);
  console.log('saveResult:', saveResult);

  return json({ ok: true });
};