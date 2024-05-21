export default function MyImage({ imageid }: { imageid: string}) {
    return (
        <div>
            <img src={`/image/${imageid}`} alt="image-${imageid}" width="100" height="100" />
        </div>
    );
}