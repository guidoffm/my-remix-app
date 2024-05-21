export type ImageState = {
    buffer: {
        type: "Buffer";
        data: number[];
    };
    type: string;
    fileName: string;
    uploader: string;
    uploadTime: string;
};