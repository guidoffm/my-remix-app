export function MyImage({ imageid, className }: { imageid: string, className?: string }) {
    return (
        <div className={`${className}`}>
            <a href={`/image/${imageid}`} target="_blank">
                <img src={`/image/${imageid}`} alt={`image-${imageid}`} />
            </a>
        </div>
    );
}