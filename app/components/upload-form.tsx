export default function UploadForm() {
    return (
        <div className="w-full max-w-xs">
            <h1 className="upload-header">Upload</h1>
            <form method="post" encType="multipart/form-data" className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <input type="file" name="avatar" 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username"
           />
                <button type="submit" 
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                        >Upload</button>
            </form>
        </div>
    );
}