export const UploadForm = ({ fileFieldName }: { fileFieldName: string }) => {
    return (
        <div className="w-full max-w-xl mt-2">
            <form method="post" encType="multipart/form-data" className="bg-gray-100 shadow-md rounded px-8 pt-8 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="avatar">
                        Choose a file
                    </label>
                    <input type="file" name={fileFieldName}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <button type="submit"
                    className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                >Upload</button>
            </form>
        </div>
    );
}